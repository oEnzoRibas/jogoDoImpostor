import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useGame } from "../../context/GameContext";
import { socketService } from "../../services/socket";
import { getAvailableThemes } from "@jdi/shared/src/themes";
import { ThemeUploader } from "./ThemeUploader";

// Temas Padrão
const AVAILABLE_THEMES = getAvailableThemes();

const WaitingRoomScreen = () => {
  const { room, me, startGame, leaveRoom, gameState } = useGame();

  // STATES
  const [availableThemes, setAvailableThemes] =
    useState<string[]>(AVAILABLE_THEMES);
  const [selectedTheme, setSelectedTheme] = useState(AVAILABLE_THEMES[0]);
  const [showThemeModal, setShowThemeModal] = useState(false);

  // EFFECTS
  useEffect(() => {
    const socket = socketService.socket;

    if (!socket) {
      console.error("Socket not found in WaitingRoomScreen");
      return;
    }

    if (!socket.connected) {
      console.warn(
        "⚠️ WaitingRoom: Socket existe, mas está desconectado (id:",
        socket.id,
        ")",
      );
    } else {
      console.log(
        "✅ WaitingRoom: Socket conectado e pronto (id:",
        socket.id,
        ")",
      );

      const handleThemesUpdate = (newCustomThemes: string[]) => {
        console.log("🔥 EVENTO RECEBIDO! Payload:", newCustomThemes);

        if (!Array.isArray(newCustomThemes)) {
          console.error(
            "❌ Erro: Backend mandou algo que não é array:",
            newCustomThemes,
          );
          return;
        }

        setAvailableThemes((prev) => {
          const combined = Array.from(
            new Set([...AVAILABLE_THEMES, ...newCustomThemes]),
          );
          console.log("🔄 Atualizando lista para:", combined);
          return combined;
        });

        toast.success("Lista de temas atualizada!");

        if (newCustomThemes.length > 0) {
          setSelectedTheme(newCustomThemes[newCustomThemes.length - 1]);
        }
      };

      socket.off("themes_updated");
      socket.on("themes_updated", handleThemesUpdate);

      return () => {
        socket.off("themes_updated", handleThemesUpdate);
      };
    }
  }, [socketService.socket]);

  const handleStartGame = () => {
    if (room && room.players.length < 2) {
      toast.error("É necessário pelo menos 2 jogadores para iniciar.");
      return;
    }
    startGame(selectedTheme);
  };

  if (!room || !me) return <div>Carregando...</div>;

  const copyToClipboard = async () => {
    const textToCopy = room.id;
    // ... (Lógica de copy mantida igual)
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Código copiado!");
    } catch {
      // Fallback simples
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast.success("Código copiado!");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", color: "white" }}>

      <p>Current Game State: {gameState}</p>

      {/* MODAL NO TOPO PARA EVITAR Z-INDEX BUG */}
      {showThemeModal && (
        <ThemeUploader onClose={() => setShowThemeModal(false)} />
      )}

      <h1>Sala de Espera</h1>

      {/* CÓDIGO DA SALA */}
      <div
        style={{
          margin: "20px 0",
          padding: "20px",
          background: "#333",
          borderRadius: "8px",
          display: "inline-block",
        }}
      >
        <p style={{ margin: 0, fontSize: "14px", color: "#aaa" }}>CÓDIGO:</p>
        <h2
          onClick={copyToClipboard}
          style={{
            margin: "5px 0",
            fontSize: "40px",
            letterSpacing: "5px",
            cursor: "pointer",
            color: "#4ade80",
          }}
          title="Clique para copiar"
        >
          {room.id}
        </h2>
      </div>

      <h2>Jogadores ({room.players.length})</h2>

      {/* LISTA DE JOGADORES */}
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {room.players.map((player) => (
            <li
              key={player.id}
              style={{
                background: player.id === me?.id ? "#444" : "#222",
                padding: "10px",
                margin: "5px 0",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: player.isHost ? "1px solid gold" : "none",
              }}
            >
              <span style={{ fontWeight: "bold" }}>
                {player.name} {player.id === me?.id && "(Você)"}
              </span>
              {player.isHost && <span style={{ color: "gold" }}>👑 Host</span>}
            </li>
          ))}
        </ul>
      </div>

      {/* ÁREA DE CONTROLES (HOST) */}
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
        }}
      >
        {me?.isHost && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <label>Tema:</label>

              {/* SELECT BLINDADO */}
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  minWidth: "200px",
                  color: "black", // Garante contraste
                }}
              >
                {availableThemes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowThemeModal(true)}
              style={{
                background: "transparent",
                border: "1px dashed #aaa",
                color: "#ccc",
                padding: "8px 16px",
                cursor: "pointer",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              + Criar Tema Personalizado
            </button>
          </div>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={leaveRoom}
            style={{
              padding: "10px 20px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Sair
          </button>

          {me?.isHost ? (
            <button
              onClick={handleStartGame}
              disabled={room.players.length < 2}
              style={{
                padding: "10px 20px",
                background: room.players.length < 2 ? "#868686" : "#22c55e",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: room.players.length < 2 ? "not-allowed" : "pointer",
              }}
            >
              {room.players.length < 2
                ? "Aguardando Jogadores..."
                : "Iniciar Jogo 🚀"}
            </button>
          ) : (
            <p style={{ color: "#aaa" }}>Aguardando o Host iniciar...</p>
          )}
        </div>
      </div>
    </div>
  );
};;

export default WaitingRoomScreen;