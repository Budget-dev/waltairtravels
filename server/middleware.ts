import type { Request, Response, NextFunction } from 'express';
import { metricsCollector } from './metrics';

/**
 * Generates unique UUID-like request correlation ID
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const incomingId = req.header('x-request-id');
  const requestId = incomingId || `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
}

/**
 * Request timing and metrics tracking middleware
 */
export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationMs = diff[0] * 1000 + diff[1] / 1e6;
    const isSuccess = res.statusCode < 400;
    metricsCollector.recordRequest(durationMs, isSuccess);

    // High performance structured log
    if (req.url.startsWith('/api') && !req.url.startsWith('/api/health') && !req.url.startsWith('/api/metrics')) {
      console.log(
        `[API] ${req.method} ${req.originalUrl || req.url} -> ${res.statusCode} in ${durationMs.toFixed(2)}ms (reqId: ${res.getHeader('X-Request-Id')})`
      );
    }
  });

  next();
}

/**
 * Token-Bucket In-Memory Rate Limiter (Zero external dependencies)
 * Protects APIs against denial-of-service / brute-force attacks
 */
interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

const rateLimitStore = new Map<string, RateLimitBucket>();

export function createRateLimiter(options: { maxTokens: number; refillRatePerSec: number }) {
  const { maxTokens, refillRatePerSec } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    // Only rate limit /api endpoints
    if (!req.url.startsWith('/api')) {
      return next();
    }

    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    let bucket = rateLimitStore.get(ip);
    if (!bucket) {
      bucket = { tokens: maxTokens, lastRefill: now };
      rateLimitStore.set(ip, bucket);
    } else {
      // Refill tokens based on elapsed time
      const elapsedSec = (now - bucket.lastRefill) / 1000;
      bucket.tokens = Math.min(maxTokens, bucket.tokens + elapsedSec * refillRatePerSec);
      bucket.lastRefill = now;
    }

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      res.setHeader('X-RateLimit-Limit', maxTokens);
      res.setHeader('X-RateLimit-Remaining', Math.floor(bucket.tokens));
      next();
    } else {
      res.status(429).json({
        type: 'https://httpstatuses.com/429',
        title: 'Too Many Requests',
        status: 429,
        detail: 'Rate limit exceeded. Please throttle your requests.',
        instance: req.originalUrl,
      });
    }
  };
}

/**
 * RFC 7807 Problem Details Standardized Error Handler
 */
export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction): void {
  const statusCode = typeof err.status === 'number' ? err.status : 500;
  const requestId = res.getHeader('X-Request-Id') || 'unknown';

  console.error(`[Error] [${requestId}] ${err.message || 'Internal Server Error'}`, err.stack);

  res.status(statusCode).json({
    type: `https://httpstatuses.com/${statusCode}`,
    title: err.name || 'Internal Server Error',
    status: statusCode,
    detail: err.message || 'An unexpected error occurred processing your request.',
    instance: req.originalUrl,
    requestId,
    timestamp: new Date().toISOString(),
  });
}
