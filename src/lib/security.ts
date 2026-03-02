/**
 * Security utilities for input sanitization, XSS prevention, and CSRF protection.
 */

// HTML entity map for encoding
const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
  "`": "&#96;",
};

/**
 * Sanitize a string by escaping HTML entities to prevent XSS.
 */
export function sanitizeHTML(input: string): string {
  return input.replace(/[&<>"'`/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Strip all HTML tags from a string.
 */
export function stripTags(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

/**
 * Sanitize user input: trim, strip tags, limit length.
 */
export function sanitizeInput(input: string, maxLength = 1000): string {
  if (typeof input !== "string") return "";
  return stripTags(input.trim()).slice(0, maxLength);
}

/**
 * Validate and sanitize an email address.
 */
export function sanitizeEmail(email: string): string {
  const sanitized = sanitizeInput(email, 255).toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(sanitized) ? sanitized : "";
}

/**
 * Validate a URL is safe (http/https only).
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Generate a CSRF token and store in sessionStorage.
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const token = Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
  sessionStorage.setItem("csrf-token", token);
  return token;
}

/**
 * Validate a CSRF token against stored value.
 */
export function validateCSRFToken(token: string): boolean {
  const stored = sessionStorage.getItem("csrf-token");
  if (!stored || !token) return false;
  // Constant-time comparison
  if (stored.length !== token.length) return false;
  let result = 0;
  for (let i = 0; i < stored.length; i++) {
    result |= stored.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Rate limiter for client-side form submissions.
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  maxAttempts = 5,
  windowMs = 60000
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxAttempts) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * Content Security Policy meta tag content (for reference).
 * Applied via SecurityHeaders component.
 */
export const CSP_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https: http:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://fonts.googleapis.com https://fonts.gstatic.com",
  "frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com",
  "media-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");
