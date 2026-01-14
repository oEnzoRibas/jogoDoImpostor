import { createClient } from "redis";
import { Server } from "socket.io";
import { createServer } from "http";
import "dotenv/config";
import { triggerAsyncId } from "async_hooks";

const PORT = process.env.PORT || 3000;
const REDIS_URL = process.env.REDIS_URL || "redis://redis:6379";

async function bootstrap() {
  console.log("🚀 Iniciando servidor...");

  // Conexão Redis
  const pubClient = createClient({ url: REDIS_URL });
  pubClient.on("error", (err) => console.error("Redis Error:", err));
  await pubClient.connect();
  console.log(`✅ Redis conectado`);

  // Server HTTP + Socket
  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`👤 Cliente conectado: ${socket.id}`);
  });

  httpServer.listen(PORT, () => {
    console.log(`🔥🔥🔥 Backend rodando na porta ${PORT}`);
  });
}

bootstrap();
