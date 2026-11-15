// One clock for the build snapshot and the live package list. Short ages stay
// in days until a month has passed; there is no separate week-sized label.
export function relativeTime(value, now = Date.now()) {
  if (value == null || value === "") return "unknown date";
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp) || !Number.isFinite(now)) return "unknown date";
  const elapsed = Math.max(0, now - timestamp);
  const minute = 60_000;
  const day = 24 * 60 * minute;
  const units = [
    ["year", 365 * day],
    ["month", 30 * day],
    ["day", day],
    ["hour", 60 * minute],
    ["minute", minute]
  ];
  for (const [unit, duration] of units) {
    if (elapsed >= duration) {
      const count = Math.floor(elapsed / duration);
      return `${count} ${unit}${count === 1 ? "" : "s"} ago`;
    }
  }
  return "just now";
}
