import { createClient } from "redis";
import { createServer } from "http";
import "dotenv/config";
import { setupSocket } from "./socket.js";

const PORT = process.env.BACKEND_PORT || 3000;
const REDIS_URL = process.env.REDIS_URL || "redis://redis:6379";

async function bootstrap() {
  try {
    console.log("🚀 Iniciando servidor...");

    // Conexão Redis
    const pubClient = createClient({ url: REDIS_URL });
    pubClient.on("error", (err) => console.error("Redis Error:", err));
    await pubClient.connect();
    console.log(`✅ Redis conectado`);

    // Server HTTP + Socket
    const httpServer = createServer();
    const io = setupSocket(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`🔥🔥🔥 Backend rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
  }
}

bootstrap();
