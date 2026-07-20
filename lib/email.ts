/**
 * Email hardening helpers shared by authentication and the enquiry form.
 * - normalizeEmail: trim + lowercase so the same address is stored consistently
 * - isValidEmail: stricter-than-usual RFC-ish format + length check
 * - isDisposableEmail: block throwaway / temporary inbox providers
 */

// Practical, single-dot-in-domain format check (rejects "a@b", "a@@b", spaces).
const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/** Common disposable / temporary email domains to reject at sign-up. */
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.info", "guerrillamail.biz",
  "sharklasers.com", "grr.la", "spam4.me", "10minutemail.com", "10minutemail.net",
  "20minutemail.com", "tempmail.com", "temp-mail.org", "tempmail.net", "tempmailo.com",
  "tmpmail.org", "tmpmail.net", "throwawaymail.com", "throwaway.email", "getnada.com",
  "nada.email", "dispostable.com", "yopmail.com", "yopmail.net", "trashmail.com",
  "trashmail.net", "mailnesia.com", "mohmal.com", "fakeinbox.com", "fakemail.net",
  "maildrop.cc", "mintemail.com", "mailcatch.com", "emailondeck.com", "moakt.com",
  "mytemp.email", "spambog.com", "spamgourmet.com", "discard.email", "discardmail.com",
  "getairmail.com", "inboxbear.com", "harakirimail.com", "burnermail.io", "email-temp.com",
  "tempinbox.com", "vomoto.com", "wegwerfmail.de", "einrot.com", "mailtemp.net",
  "1secmail.com", "1secmail.net", "1secmail.org", "cs.email", "temp-mail.io",
]);

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  return EMAIL_RE.test(email);
}

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? DISPOSABLE_DOMAINS.has(domain) : false;
}
