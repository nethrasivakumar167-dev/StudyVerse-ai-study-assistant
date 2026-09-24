/**
 * In-memory sliding window rate limiter for AI generation routes.
 * Protects against quota flooding and ensures fair usage per client.
 */

const clientRequests = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 25; // 25 AI generation requests per minute per client

export const aiRateLimiter = (req, res, next) => {
  const identifier = req.userId || req.ip || req.headers['x-forwarded-for'] || 'anonymous';
  const now = Date.now();
  const record = clientRequests.get(identifier) || { count: 0, resetAt: now + WINDOW_MS };

  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + WINDOW_MS;
  } else {
    record.count += 1;
  }

  clientRequests.set(identifier, record);

  // Clean stale records periodically to prevent memory leaks
  if (clientRequests.size > 1000) {
    for (const [key, val] of clientRequests.entries()) {
      if (now > val.resetAt) clientRequests.delete(key);
    }
  }

  if (record.count > MAX_REQUESTS) {
    return res.status(429).json({
      error: true,
      message: 'Too many AI requests. Please wait a minute before trying again.',
      code: 'RATE_LIMIT_EXCEEDED'
    });
  }

  next();
};
