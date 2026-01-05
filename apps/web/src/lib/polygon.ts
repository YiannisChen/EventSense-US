export type PolygonAgg = {
  t: number; // unix ms
  o: number;
  h: number;
  l: number;
  c: number;
  v?: number;
};

export type PolygonAggResponse = {
  results?: PolygonAgg[];
  adjusted?: boolean;
  queryCount?: number;
  resultsCount?: number;
  status?: string;
  request_id?: string;
  error?: string;
};

export async function fetchDailyAggs({
  ticker,
  from,
  to,
  signal,
}: {
  ticker: string;
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  signal?: AbortSignal;
}): Promise<PolygonAgg[]> {
  const url =
    `/api/polygon/v2/aggs/ticker/${encodeURIComponent(ticker)}` +
    `/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=5000`;

  const res = await fetch(url, { signal });
  const json = (await res.json()) as PolygonAggResponse;
  if (!res.ok || json.status === "ERROR") {
    throw new Error(json.error || `Polygon request failed (${res.status})`);
  }
  return json.results ?? [];
}

export async function fetchIntradayAggs({
  ticker,
  date,
  multiplier,
  timespan,
  signal,
}: {
  ticker: string;
  date: string; // YYYY-MM-DD
  multiplier: number; // e.g. 5
  timespan: "minute";
  signal?: AbortSignal;
}): Promise<PolygonAgg[]> {
  const url =
    `/api/polygon/v2/aggs/ticker/${encodeURIComponent(ticker)}` +
    `/range/${multiplier}/${timespan}/${date}/${date}?adjusted=true&sort=asc&limit=5000`;

  const res = await fetch(url, { signal });
  const json = (await res.json()) as PolygonAggResponse;
  if (!res.ok || json.status === "ERROR") {
    throw new Error(json.error || `Polygon request failed (${res.status})`);
  }
  return json.results ?? [];
}


