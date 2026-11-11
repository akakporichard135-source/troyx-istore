// TroyX Control Center - In-Memory IP Rate Limiting
// Protects authentication endpoints against brute force attacks

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * Checks whether an IP has exceeded maximum permitted requests within a window
 * @param ip Client IP address
 * @param maxAttempts Maximum allowed attempts (default 5)
 * @param windowMs Window duration in milliseconds (default 15 minutes)
 */
export function checkRateLimit(
  ip: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // Clean expired
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1, retryAfterSeconds: 0 };
  }

  if (record.count >= maxAttempts) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds: retryAfter };
  }

  record.count += 1;
  return { allowed: true, remaining: maxAttempts - record.count, retryAfterSeconds: 0 };
}

/**
 * Reset rate limit for an IP upon successful login
 */
export function resetRateLimit(ip: string): void {
  rateLimitMap.delete(ip);
}
