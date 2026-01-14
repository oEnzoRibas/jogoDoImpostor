import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  // transports: ["websocket"],
  autoConnect: false,
});

function App() {
  const [connected, setConnected] = useState(false);
  const [socketId, setSocketId] = useState("");

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      setConnected(true);
      setSocketId(socket.id || "");
      console.log("Conectado ao backend!");
    });

    socket.on("disconnect", () => {
      setConnected(false);
      console.log("Desconectado.");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        flexDirection: "column",
        display: "flex",
        marginTop: "50px",
        fontFamily: "arial",
      }}
    >
      <h1>Jogo do Impostor</h1>
      <div
        style={{
          padding: "20px",
          border: "1px solid #ccc",
          display: "inline-block",
          borderRadius: "8px",
        }}
      >
        <h2>Status do Sistema</h2>
        <p>
          Backend:
          <span
            style={{
              color: connected ? "green" : "red",
              fontWeight: "bold",
              marginLeft: "8px",
            }}
          >
            {connected ? "ONLINE" : "OFFLINE"}
          </span>
        </p>
        {connected && (
          <p>
            Seu ID: <code>{socketId}</code>
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
