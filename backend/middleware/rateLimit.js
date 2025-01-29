import { rateLimit } from "express-rate-limit";
import { errorHandler } from "#middleware/errorHandler.js";
import ApiError from "#utils/ApiError.js";
import { RATE_LIMIT_EXCEEDED } from "../../error_codes.js";
import RedisStore from "rate-limit-redis";
import { getRedisClient } from "#utils/redis.js";
import { AI_ROUTES_RATE_LIMIT_PER_MIN } from "../../constants.js";

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
      NODE_ENV === "prod"
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
    windowMs: 60 * 1000,
    max: AI_ROUTES_RATE_LIMIT_PER_MIN,
    type: "AI",
  }),
};
