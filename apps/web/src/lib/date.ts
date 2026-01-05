export function clampTicker(t: string): string {
  return t.trim().toUpperCase();
}

export function toISODateUTC(d: Date): string {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function parseISODateToUTC(dateStr: string): Date {
  // dateStr: YYYY-MM-DD
  const [y, m, d] = dateStr.split("-").map((x) => Number.parseInt(x, 10));
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0));
}

export function addDaysUTC(dateStr: string, deltaDays: number): string {
  const d = parseISODateToUTC(dateStr);
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return toISODateUTC(d);
}


