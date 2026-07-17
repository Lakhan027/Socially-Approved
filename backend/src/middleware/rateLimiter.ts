import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

interface RateBucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateBucket>();

export function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const key = req.ip || "unknown";
  const now = Date.now();
  const window = env.RATE_LIMIT_WINDOW_MS;
  const limit = env.RATE_LIMIT_MAX;

  let bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + window };
    buckets.set(key, bucket);
  }

  bucket.count += 1;

  const remaining = Math.max(0, limit - bucket.count);
  const resetSeconds = Math.ceil((bucket.resetAt - now) / 1000);

  res.setHeader("X-RateLimit-Limit", String(limit));
  res.setHeader("X-RateLimit-Remaining", String(remaining));
  res.setHeader("X-RateLimit-Reset", String(resetSeconds));

  if (bucket.count > limit) {
    res.status(429).json({
      success: false,
      message: "Too many requests, please try again later.",
    });
    return;
  }

  next();
}
