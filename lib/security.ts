import { NextRequest, NextResponse } from "next/server";

const requestBuckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(request: NextRequest, limit = 60, windowMs = 60_000) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";
  const now = Date.now();
  const bucket = requestBuckets.get(ip);

  if (!bucket || bucket.resetAt < now) {
    requestBuckets.set(ip, { count: 1, resetAt: now + windowMs });
    return null;
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  return null;
}

export function validateCsrf(request: NextRequest) {
  const token = request.headers.get("x-csrf-token");
  if (process.env.NODE_ENV !== "production") return true;
  return Boolean(token && token === process.env.CSRF_SECRET);
}
