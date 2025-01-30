import redis from "redis";
import { REDIS_CONFIG } from "#config/config.js";
// global redis client
let redisClient = null;

export async function initRedis() {
  console.log("Connecting to redis...");
  redisClient = redis.createClient(REDIS_CONFIG);

  try {
    await redisClient.connect();
    console.log("Connected to redis");
  } catch (error) {
    console.log("Failed to connect to redis\n", error);
  }

  redisClient.on("error", (err) => {
    console.error("Redis connection error:", err);
  });

  return redisClient;
}
/**
 * Returns the global redis client
 * @returns {redis.RedisClient}
 */
export function getRedisClient() {
  return redisClient;
}
