export function sanitizeCallbackUrl(url?: string, fallback = "/profile"): string {
  if (!url) return fallback
  if (url.startsWith("//")) return fallback
  if (url.startsWith("/")) return url
  return fallback
}
