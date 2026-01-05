import React from "react";
import { ChevronDown, RefreshCw, Play } from "lucide-react";
import { TickerCombobox } from "./TickerCombobox";

export interface AttributionPanelProps {
  ticker: string;
  onTickerChange: (ticker: string) => void;
  selectedDayET: string;
  onSelectedDayChange: (isoDate: string) => void;
  nlQuery: string;
  onNlQueryChange: (q: string) => void;
  options: {
    hybridRetrieval: boolean;
    secondPass: boolean;
    relatedEntities: boolean;
  };
  onOptionsChange: (next: AttributionPanelProps["options"]) => void;
  isRunning: boolean;
  onRun: () => void;
  onReset: () => void;
}

function ToggleOption({
  label,
  helper,
  checked,
  onChange,
}: {
  label: string;
  helper: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="es-hstack" style={{ alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 560, color: "var(--es-text)", marginBottom: 2 }}>
          {label}
        </div>
        <div className="es-caption">{helper}</div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          flexShrink: 0,
          position: "relative",
          borderRadius: 999,
          transition: "background 140ms ease",
          width: 44,
          height: 24,
          background: checked ? "var(--es-accent)" : "var(--es-border-strong)",
        }}
        aria-pressed={checked}
      >
        <div
          style={{
            position: "absolute",
            top: 2,
            left: checked ? 22 : 2,
            width: 20,
            height: 20,
            background: "#fff",
            borderRadius: 999,
            transition: "left 140ms ease",
            boxShadow: "0 1px 2px rgb(16 24 40 / 0.10)",
          }}
        />
      </button>
    </div>
  );
}

export function AttributionPanel({
  ticker,
  onTickerChange,
  selectedDayET,
  onSelectedDayChange,
  nlQuery,
  onNlQueryChange,
  options,
  onOptionsChange,
  isRunning,
  onRun,
  onReset,
}: AttributionPanelProps) {
  const canRun = Boolean(ticker.trim()) && Boolean(selectedDayET) && !isRunning;
  const hasRequiredInputs = Boolean(ticker.trim()) && Boolean(selectedDayET);
  const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false);
  const advInnerRef = React.useRef<HTMLDivElement | null>(null);
  const advMaxHeight = isAdvancedOpen ? (advInnerRef.current?.scrollHeight ?? 0) + 24 : 0;

  return (
    <div className="es-card es-card-pad es-panel">
        <div className="es-hstack" style={{ justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <div className="es-h2">Attribution Panel</div>
          <span className="es-chip es-chip-muted">US/Eastern</span>
        </div>

        {/* Request */}
        <div className="es-vstack-tight es-panel-content" style={{ gap: 12 }}>
          <div>
            <label className="es-label" style={{ display: "block", marginBottom: 6 }}>
              Ticker
            </label>
            <TickerCombobox value={ticker} onChange={onTickerChange} placeholder="NVDA" ariaLabel="Ticker" />
          </div>

          <div>
            <label className="es-label" style={{ display: "block", marginBottom: 6 }}>
              Selected Day (ET)
            </label>
            <input
              className="es-input w-full"
              type="date"
              value={selectedDayET}
              onChange={(e) => onSelectedDayChange(e.target.value)}
            />
            <div className="es-caption" style={{ marginTop: 6 }}>
              Single-day attribution. You can also select the day from the chart.
            </div>
          </div>

          <div>
            <label className="es-label" style={{ display: "block", marginBottom: 6 }}>
              Query (optional)
            </label>
            <textarea
              value={nlQuery}
              placeholder="Why did NVDA drop on Jan 15, 2026?"
              className="es-textarea"
              onChange={(e) => onNlQueryChange(e.target.value)}
            />
          </div>

          {/* Advanced options */}
          <div className="es-adv">
            <button
              type="button"
              className="es-adv-trigger"
              onClick={() => setIsAdvancedOpen((v) => !v)}
              aria-expanded={isAdvancedOpen}
            >
              <span>Advanced options</span>
              <ChevronDown
                style={{
                  width: 16,
                  height: 16,
                  color: "var(--es-text-muted)",
                  transform: isAdvancedOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 200ms ease",
                }}
              />
            </button>
            <div
              className="es-adv-body"
              style={{
                maxHeight: advMaxHeight,
                opacity: isAdvancedOpen ? 1 : 0,
                transform: isAdvancedOpen ? "translateY(0px)" : "translateY(-4px)",
              }}
              aria-hidden={!isAdvancedOpen}
            >
              <div ref={advInnerRef} className="es-adv-body-inner">
                <div className="es-vstack-tight" style={{ gap: 12 }}>
                  <ToggleOption
                    label="Hybrid Retrieval (BM25 + Vector)"
                    helper="Combines keyword and semantic search"
                    checked={options.hybridRetrieval}
                    onChange={(v) => onOptionsChange({ ...options, hybridRetrieval: v })}
                  />
                  <ToggleOption
                    label="Second-pass Retrieval (≤1)"
                    helper="Only when evidence gap is detected"
                    checked={options.secondPass}
                    onChange={(v) => onOptionsChange({ ...options, secondPass: v })}
                  />
                  <ToggleOption
                    label="1-hop Related Entities"
                    helper="Industry / peers / subsidiary"
                    checked={options.relatedEntities}
                    onChange={(v) => onOptionsChange({ ...options, relatedEntities: v })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions (sticky) */}
          <div className="es-panel-actions">
            <div className="es-hstack" style={{ gap: 12 }}>
              <button
                type="button"
                className="es-btn es-btn-primary"
                style={{ flex: 1 }}
                onClick={onRun}
                disabled={!canRun}
              >
                <Play style={{ width: 16, height: 16 }} />
                {isRunning ? "Running…" : "Run Attribution"}
              </button>
              <button type="button" className="es-btn es-btn-ghost" onClick={onReset} disabled={isRunning}>
                <RefreshCw style={{ width: 16, height: 16 }} />
                Reset
              </button>
            </div>
            {!hasRequiredInputs ? (
              <div className="es-caption" style={{ marginTop: 10 }}>
                Select a ticker and a day, then run attribution.
              </div>
            ) : isRunning ? (
              <div className="es-caption" style={{ marginTop: 10 }}>
                Running attribution… exports are available after completion.
              </div>
            ) : null}
          </div>
        </div>

    </div>
  );
}


