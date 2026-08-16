import crypto from "crypto"

/**
 * Signed value for the `gtm_auth` cookie.
 *
 * The cookie used to hold the literal string "true", so anyone could forge
 * `Cookie: gtm_auth=true` and pass the gate without knowing the password. Now it
 * holds an HMAC of a fixed message keyed by GTM_PASSWORD: without the password an
 * attacker cannot produce a valid value, and the cookie stays stateless (no
 * session store) and httpOnly (server-set, XSS-resistant).
 *
 * This is Momentify's own auth mechanism, intentionally not the fleet's
 * localStorage bearer pattern — see the decision note. The token is deterministic
 * per password so existing sessions keep working until the password rotates.
 */
const MESSAGE = "gtm-authenticated"

export function gtmAuthToken(): string | null {
  const secret = process.env.GTM_PASSWORD
  if (!secret) return null
  return crypto.createHmac("sha256", secret).update(MESSAGE).digest("hex")
}

export function verifyGtmAuthToken(value: string | undefined): boolean {
  if (!value) return false
  const expected = gtmAuthToken()
  if (!expected) return false
  const a = Buffer.from(value)
  const b = Buffer.from(expected)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}
