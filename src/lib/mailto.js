/**
 * Build a mailto: URL for the contact draft form.
 *
 * Every field is percent-encoded with encodeURIComponent, and line breaks are
 * sent as CRLF (%0D%0A) as RFC 6068 recommends, so names or messages containing
 * "&", "?", "#", or newlines cannot break the URL. Very long messages can still
 * exceed some mail clients' URL limits; the page offers the address as a fallback.
 */

const DEFAULT_SUBJECT = "Portfolio inquiry";

/**
 * @param {string} to
 * @param {{ name?: string, email?: string, message?: string }} fields
 * @returns {string}
 */
export function buildMailto(to, { name = "", email = "", message = "" } = {}) {
  const subject = name ? `${DEFAULT_SUBJECT} from ${name}` : DEFAULT_SUBJECT;
  const header = [name && `Name: ${name}`, email && `Email: ${email}`].filter(Boolean);
  // Keep a blank line between the header lines and the message.
  const normalizedMessage = message.replace(/\r?\n/g, "\r\n");
  const body = [...header, ...(header.length ? [""] : []), normalizedMessage].join("\r\n");
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Loose sanity check; the visitor's own mail app is the real validator. */
export function isPlausibleEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
