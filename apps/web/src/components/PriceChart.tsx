import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CandlestickSeries, createChart, type IChartApi, type Time } from "lightweight-charts";
import { addDaysUTC, clampTicker, toISODateUTC } from "../lib/date";
import { fetchDailyAggs, fetchIntradayAggs } from "../lib/polygon";

const timeframes = ['1D', '1W', '1M', '3M', '1Y'];
const intervals = ['15m', '1h', '4h'] as const;
type Interval = (typeof intervals)[number];

const intervalMultiplierMap: Record<Interval, number> = {
  "15m": 15,
  "1h": 60,
  "4h": 240,
};

function useDemoChartFlag(): boolean {
  // Default ON for now (demo-first). Turn off by setting VITE_USE_DEMO_CHART=false
  // in your shell env when running Vite (or in a Vite-loaded env file).
  const raw = import.meta.env?.VITE_USE_DEMO_CHART as string | undefined;
  return raw !== "false";
}

export function PriceChart({
  ticker,
  selectedDayET,
  onSelectDayET,
}: {
  ticker: string;
  selectedDayET: string;
  onSelectDayET: (isoDate: string) => void;
}) {
  const useDemoChart = useDemoChartFlag();
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [selectedInterval, setSelectedInterval] = useState<Interval>('1h');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartApiRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ReturnType<IChartApi["addSeries"]> | null>(null);

  const selectedDayLabel = useMemo(() => {
    if (!selectedDayET) return "Select from chart";
    const [y, m, d] = selectedDayET.split("-");
    return `${m}/${d}/${y} (ET)`;
  }, [selectedDayET]);

  const isIntradayView = selectedTimeframe === "1D";
  const intervalKey = isIntradayView ? selectedInterval : null;

  // Create chart once (real chart mode only)
  useEffect(() => {
    if (useDemoChart) return;
    if (!chartRef.current) return;
    if (chartApiRef.current) return;

    const chart = createChart(chartRef.current, {
      layout: {
        background: { color: "transparent" },
        textColor: "rgb(107 114 128)",
      },
      grid: {
        vertLines: { color: "rgb(234 234 240)" },
        horzLines: { color: "rgb(234 234 240)" },
      },
      rightPriceScale: { borderColor: "rgb(234 234 240)" },
      timeScale: { borderColor: "rgb(234 234 240)" },
      crosshair: { mode: 1 },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "rgb(34 197 94)",
      downColor: "rgb(239 68 68)",
      borderVisible: false,
      wickUpColor: "rgb(34 197 94)",
      wickDownColor: "rgb(239 68 68)",
    });

    chartApiRef.current = chart;
    candleSeriesRef.current = series;

    const onResize = () => {
      if (!chartRef.current || !chartApiRef.current) return;
      chartApiRef.current.applyOptions({
        width: chartRef.current.clientWidth,
        height: chartRef.current.clientHeight,
      });
    };
    onResize();
    window.addEventListener("resize", onResize);

    // Click to select day (works best in daily mode)
    chart.subscribeClick((param) => {
      if (!param?.time) return;
      // lightweight-charts `time` can be a BusinessDay object or unix seconds.
      const t = param.time as unknown as Time;
      if (typeof t === "number") {
        const d = new Date(t * 1000);
        onSelectDayET(toISODateUTC(d));
      } else if (typeof t === "object" && t && "year" in t) {
        const bd = t as unknown as { year: number; month: number; day: number };
        const d = new Date(Date.UTC(bd.year, bd.month - 1, bd.day));
        onSelectDayET(toISODateUTC(d));
      }
    });

    return () => {
      window.removeEventListener("resize", onResize);
      chart.remove();
      chartApiRef.current = null;
      candleSeriesRef.current = null;
    };
  }, [onSelectDayET]);

  // Load data whenever ticker/timeframe changes (real chart mode only)
  useEffect(() => {
    if (useDemoChart) return;
    const series = candleSeriesRef.current;
    const chart = chartApiRef.current;
    if (!series || !chart) return;

    const tkr = clampTicker(ticker);
    if (!tkr) return;

    let aborted = false;
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    async function run() {
      try {
        if (selectedTimeframe === "1D") {
          const date = selectedDayET || toISODateUTC(new Date());
          const multiplier = intervalMultiplierMap[selectedInterval] ?? intervalMultiplierMap["1h"];
          const rows = await fetchIntradayAggs({
            ticker: tkr,
            date,
            multiplier,
            timespan: "minute",
            signal: controller.signal,
          });
          if (aborted) return;
          const data = rows.map((r) => ({
            time: Math.floor(r.t / 1000) as unknown as Time,
            open: r.o,
            high: r.h,
            low: r.l,
            close: r.c,
          }));
          series.setData(data);
          chart.timeScale().fitContent();
        } else {
          const anchor = selectedDayET || toISODateUTC(new Date());
          const days =
            selectedTimeframe === "1W"
              ? 10
              : selectedTimeframe === "1M"
                ? 35
                : selectedTimeframe === "3M"
                  ? 110
                  : 370; // 1Y
          const from = addDaysUTC(anchor, -days);
          const to = addDaysUTC(anchor, 1);
          const rows = await fetchDailyAggs({ ticker: tkr, from, to, signal: controller.signal });
          if (aborted) return;
          const data = rows.map((r) => {
            const d = new Date(r.t);
            const bd = { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
            return {
              time: bd as unknown as Time,
              open: r.o,
              high: r.h,
              low: r.l,
              close: r.c,
            };
          });
          series.setData(data);
          chart.timeScale().fitContent();
        }
      } catch (e) {
        if (aborted) return;
        const msg = e instanceof Error ? e.message : "Failed to load chart data";
        setError(msg);
      } finally {
        if (!aborted) {
          setIsLoading(false);
        }
      }
    }

    run();
    return () => {
      aborted = true;
      controller.abort();
    };
  }, [ticker, selectedTimeframe, intervalKey, selectedDayET, useDemoChart]);

  return (
    <div
      className="es-card es-stretch"
      style={{ display: "flex", flexDirection: "column", minHeight: 0 }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--es-border)",
          borderColor: "var(--es-border)",
          padding: "20px 24px",
        }}
      >
        <div>
          <h3 className="es-h2">Price Chart</h3>
          <div className="es-caption" style={{ marginTop: 2 }}>
            {ticker ? `${ticker} • US/Eastern` : "US/Eastern"}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          {/* Timeframe pills */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                type="button"
                className={selectedTimeframe === tf ? "es-chip es-chip-accent" : "es-chip es-chip-muted"}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Interval dropdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end", minWidth: 0 }}>
            <select
              value={selectedInterval}
              onChange={(e) => setSelectedInterval(e.target.value as Interval)}
              className="es-input"
              disabled={!isIntradayView}
              aria-disabled={!isIntradayView}
              title={isIntradayView ? "Choose intraday interval" : "Intraday intervals only available in 1D view"}
              style={{
                height: 36,
                padding: "0 12px",
                fontSize: 13,
                borderRadius: 12,
                background: isIntradayView ? "var(--es-surface)" : "var(--es-surface-subtle)",
                border: "1px solid var(--es-border)",
                color: isIntradayView ? "inherit" : "var(--es-text-muted)",
                cursor: isIntradayView ? "pointer" : "not-allowed",
              }}
            >
              {intervals.map((interval) => (
                <option key={interval} value={interval}>{interval}</option>
              ))}
            </select>
            {!isIntradayView ? (
              <span className="es-caption" style={{ color: "var(--es-text-faint)" }}>
                Intraday intervals only available in 1D view
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Chart body */}
      <div style={{ padding: 16, flex: 1, minHeight: 0, display: "flex" }}>
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
          {useDemoChart ? (
            <>
              <div
                className="es-chart-viewport"
                style={{
                  flex: 1,
                  minHeight: 360,
                  maxHeight: "clamp(520px, 58vh, 720px)",
                }}
              >
                <img
                  src="/demo_pic.png"
                  alt="Demo chart placeholder"
                  className="es-chart-img"
                />
              </div>
            </>
          ) : (
            <>
              <div
                ref={chartRef}
                className="es-chart-viewport"
                style={{ flex: 1, minHeight: 360, maxHeight: "clamp(520px, 58vh, 720px)" }}
              />

              {isLoading ? (
                <div className="es-caption" style={{ marginTop: 2 }}>
                  Loading candles…
                </div>
              ) : null}

              {error ? (
                <div style={{ marginTop: 10 }}>
                  <div className="es-caption" style={{ color: "var(--es-text-muted)" }}>
                    {error}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* Footer info */}
      <div
        className="border-t"
        style={{
          borderColor: "var(--es-border)",
          background: "var(--es-surface-subtle)",
          padding: "14px 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            flexWrap: "wrap",
            rowGap: 10,
            minWidth: 0,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div className="es-caption">Selected Day (ET)</div>
            <div style={{ fontSize: 14, fontWeight: 560, marginTop: 2, color: "var(--es-text)" }}>
              {selectedDayLabel}
            </div>
          </div>

          <div style={{ width: 1, height: 28, background: "var(--es-border)" }} />

          <div style={{ minWidth: 0 }}>
            <div className="es-caption">Price Move</div>
            <div style={{ fontSize: 14, fontWeight: 560, marginTop: 2, color: "var(--es-text)" }}>
              -8.4%
            </div>
          </div>

          <div style={{ width: 1, height: 28, background: "var(--es-border)" }} />

          <div style={{ minWidth: 0 }}>
            <div className="es-caption">Session</div>
            <div style={{ fontSize: 14, fontWeight: 560, marginTop: 2, color: "var(--es-text)" }}>
              Regular
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
