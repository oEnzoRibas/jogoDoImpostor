import { createClient } from "redis";

const url = process.env.REDIS_URL || "redis://redis:6379";

console.log(`🔗 Conectando ao Redis em ${url}...`);

export const redisClient = createClient({ url });

redisClient.on("error", (err) => console.error("Redis Client Error", err));

redisClient.connect().then(() => {
  console.log("✅ Redis conectado com sucesso!");
});
