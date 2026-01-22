import { createClient } from "redis";

const url = process.env.REDIS_URL || "redis://redis:6379";

console.log(`🔗 Connecting to Redis at ${url}...`);

export const redisClient = createClient({ url });

redisClient.on("error", (err) => console.error("Redis Client Error", err));

redisClient.connect().then(() => {
  console.log("✅ Connection to Redis established successfully.");
});
