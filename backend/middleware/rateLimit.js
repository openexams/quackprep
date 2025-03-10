import { rateLimit } from "express-rate-limit";
import { errorHandler } from "#middleware/errorHandler.js";
import ApiError from "#utils/ApiError.js";
import { RATE_LIMIT_EXCEEDED } from "../../error_codes.js";
import RedisStore from "rate-limit-redis";
import { getRedisClient } from "#utils/redis.js";
import { secrets } from "#config/secrets.js";
// be careful of redis client not being initialized

/**
 * Creates rate limiter with specified configuration
 * @param {Object} config Rate limit configuration
 * @returns {Function} Rate limit middleware
 */
export function createRateLimiter({ windowMs, max, type }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      // Use both IP and user ID if available
      const ip = req.ip;
      const userId = req.user;
      return userId ? `${ip}-${userId}` : ip;
    },
    handler: (req, res) => {
      res.setHeader("retry-after", Math.ceil(windowMs / 1000));
      errorHandler(
        new ApiError(`${type} rate limit exceeded`, 429, RATE_LIMIT_EXCEEDED),
        req,
        res
      );
    },
    store:
      secrets.NODE_ENV === "prod" && getRedisClient()
        ? new RedisStore({
            sendCommand: (...args) => getRedisClient().sendCommand(args),
          })
        : undefined,
  });
}

// Different rate limits for different types of requests
export const rateLimits = {
  // General API endpoints
  api: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 300,
    type: "API",
  }),

  // AI-specific endpoints
  ai: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: secrets.NODE_ENV === "local" ? 15 : 4,
    type: "AI",
  }),

  auth: createRateLimiter({
    windowMs: 60 * 10000, // 10 minute
    max: 30,
    type: "AUTH",
  }),
};
