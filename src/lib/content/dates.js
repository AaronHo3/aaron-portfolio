/**
 * Date helpers for date-only strings ("YYYY-MM-DD") and times ("HH:MM").
 *
 * Dates are kept as strings end to end. Parsing "2026-10-18" with `new Date()`
 * yields UTC midnight, which renders as Oct 17 west of Greenwich; every helper
 * here pins UTC when it needs a Date so the calendar day never shifts.
 */

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_24H = /^([01]\d|2[0-3]):([0-5]\d)$/;

/** @param {unknown} value @returns {boolean} */
export function isIsoDate(value) {
  if (typeof value !== "string") return false;
  const match = ISO_DATE.exec(value);
  if (!match) return false;
  const [y, m, d] = match.slice(1).map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

/** @param {unknown} value @returns {boolean} */
export function isTime(value) {
  return typeof value === "string" && TIME_24H.test(value);
}

/**
 * Accepts a front matter value and returns a "YYYY-MM-DD" string when possible.
 * YAML 1.1 parsers turn bare dates into Date objects at UTC midnight, so the
 * UTC components are the intended calendar day.
 * @param {unknown} value
 * @returns {unknown}
 */
export function normalizeDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return typeof value === "string" ? value.trim() : value;
}

/**
 * Today's calendar date in an IANA time zone.
 * @param {string} timeZone
 * @param {Date} [now]
 * @returns {string} "YYYY-MM-DD"
 */
export function todayIn(timeZone, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (type) => parts.find((p) => p.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/** @param {string} iso @returns {Date} UTC midnight of that day */
function utcDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/**
 * "2026-10-18" -> "October 18, 2026" (or a shorter style via options).
 * @param {string} iso
 * @param {Intl.DateTimeFormatOptions} [options]
 */
export function formatDate(iso, options = { year: "numeric", month: "long", day: "numeric" }) {
  if (!isIsoDate(iso)) return "";
  return utcDate(iso).toLocaleDateString("en-US", { ...options, timeZone: "UTC" });
}

/** "2026-10-18" -> "Sunday" */
export function weekdayOf(iso) {
  return formatDate(iso, { weekday: "long" });
}

/** "19:00" -> "7:00 PM" */
export function formatTime(time) {
  if (!isTime(time)) return "";
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** RFC 822 date for RSS, at UTC midnight of the given day. */
export function toRfc822(iso) {
  return utcDate(iso).toUTCString();
}
