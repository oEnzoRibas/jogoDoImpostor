import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { socketService } from "../../services/socket";
import toast from "react-hot-toast";

const GameScreen = () => {
  const { room, me, mySecret } = useGame();
  const [wordInput, setWordInput] = useState("");
  const [hoveredPlayerId, setHoveredPlayerId] = useState<string | null>(null);

  const [showSecret, setShowSecret] = useState(false);

  if (!room || !me) return <div>Carregando...</div>;

  const isMyTurn = room.turnPlayerId === me.id;

  const isImpostor = me.isImpostor;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wordInput.trim()) return;

    if (wordInput.trim().includes(" ")) {
      return toast.error("Escreva apenas uma palavra!");
    }

    socketService.socket?.emit("submit_word", { word: wordInput });
    setWordInput("");
  };

  return (
    <div style={{ textAlign: "center", color: "white", padding: "20px" }}>
      {/* --- NOVO COMPONENTE: CARTÃO DE IDENTIDADE --- */}
      <div
        onClick={() => setShowSecret(!showSecret)}
        style={{
          background: isImpostor ? "#7f1d1d" : "#14532d", // Fundo Vermelho ou Verde escuro
          border: `2px solid ${isImpostor ? "#ef4444" : "#4ade80"}`,
          borderRadius: "12px",
          padding: "15px",
          marginBottom: "30px",
          cursor: "pointer",
          maxWidth: "400px",
          margin: "0 auto 30px auto",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          transition: "all 0.2s",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            color: "#ddd",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          SUA IDENTIDADE (CLIQUE PARA {showSecret ? "ESCONDER" : "VER"})
        </p>

        <div
          style={{ marginTop: "10px", fontSize: "24px", fontWeight: "bold" }}
        >
          {showSecret ? (
            // CONTEÚDO REVELADO
            isImpostor ? (
              <span style={{ color: "#fca5a5" }}>🕵️‍♂️ VOCÊ É O IMPOSTOR!</span>
            ) : (
              <div>
                <span style={{ color: "#86efac" }}>
                  🤫 Palavra: {mySecret?.word}
                </span>
                <br />
                <span>🤫 Tema: {mySecret?.theme}</span>
              </div>
            )
          ) : (
            // CONTEÚDO ESCONDIDO
            <span style={{ filter: "blur(8px)", userSelect: "none" }}>
              {isImpostor ? "IMPOSTOR" : "PALAVRA SECRETA"}
            </span>
          )}
        </div>

        {/* Dica extra para o impostor */}
        {showSecret && isImpostor && (
          <p
            style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#fca5a5" }}
          >
            Engane os outros. Descubra a palavra.
          </p>
        )}
      </div>

      {/* CABEÇALHO */}
      <h2>GameState : {room.gameState}</h2>
      <h1>
        Rodada {room.currentRound} / {room.maxRounds}
      </h1>
      <h3 style={{ color: "#aaa" }}>
        {isMyTurn
          ? "Sua vez! Escreva uma dica."
          : `Vez de: ${room.players.find((p) => p.id === room.turnPlayerId)?.name}`}
      </h3>

      {/* ÁREA DOS JOGADORES (GRID / CIRCULO) */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "40px",
          marginTop: "50px",
        }}
      >
        {room.players.map((player) => {
          // Lógica auxiliar para facilitar a leitura
          const safeWordsList = player.wordsList || [];

          const isHovered = hoveredPlayerId === player.id;
          const hasWords = safeWordsList.length > 0;
          const lastWord = hasWords
            ? safeWordsList[safeWordsList.length - 1]
            : "";

          return (
            <div key={player.id} style={{ position: "relative" }}>
              {/* O BALÃO DE FALA */}
              {hasWords && (
                <div
                  // Eventos de Mouse para controlar o Hover
                  onMouseEnter={() => setHoveredPlayerId(player.id)}
                  onMouseLeave={() => setHoveredPlayerId(null)}
                  style={{
                    position: "absolute",
                    bottom: "110%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "white",
                    color: "black",
                    padding: "8px 15px",
                    borderRadius: "15px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    whiteSpace: "nowrap", // Impede quebra de linha indesejada
                    boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
                    zIndex: 10,
                    cursor: "pointer", // Indica que é interativo
                    minWidth: "60px",
                    transition: "all 0.2s ease",
                  }}
                >
                  {/* CONTEÚDO DO BALÃO: Condicional */}
                  {isHovered ? (
                    // VISÃO HOVER: Lista Completa
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        textAlign: "left",
                      }}
                    >
                      <small
                        style={{
                          color: "#666",
                          fontSize: "10px",
                          textAlign: "center",
                          borderBottom: "1px solid #eee",
                          paddingBottom: "2px",
                        }}
                      >
                        Histórico
                      </small>
                      {safeWordsList.map((word, index) => (
                        <div key={index}>
                          <span
                            style={{
                              color: "#888",
                              fontSize: "11px",
                              marginRight: "4px",
                            }}
                          >
                            {index + 1}º:
                          </span>
                          {word}
                        </div>
                      ))}
                    </div>
                  ) : (
                    // VISÃO PADRÃO: Apenas a última palavra
                    <span>{lastWord}</span>
                  )}

                  {/* Triângulo do balão (Só um detalhe visual) */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-6px",
                      left: "50%",
                      marginLeft: "-6px",
                      width: 0,
                      height: 0,
                      borderLeft: "6px solid transparent",
                      borderRight: "6px solid transparent",
                      borderTop: "6px solid white",
                    }}
                  />
                </div>
              )}

              {/* O ICONE DO JOGADOR */}
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background:
                    player.id === room.turnPlayerId ? "#fbbf24" : "#444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "30px",
                  border:
                    player.id === me.id
                      ? "3px solid #4ade80"
                      : "3px solid transparent",
                  transition: "all 0.3s ease",
                }}
              >
                {player.name.charAt(0).toUpperCase()}
              </div>

              <p style={{ marginTop: "10px", fontWeight: "bold" }}>
                {player.name}
              </p>
            </div>
          );
        })}
      </div>

      {/* ÁREA DE INPUT */}
      {isMyTurn && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxWidth: "400px",
            background: "#222",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 -5px 20px rgba(0,0,0,0.5)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: "10px" }}
          >
            <input
              type="text"
              placeholder="Uma palavra..."
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
              autoFocus
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#22c55e",
                color: "white",
                border: "none",
                padding: "0 20px",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Enviar
            </button>
          </form>
          <small style={{ color: "#888", marginTop: "5px", display: "block" }}>
            Escreva apenas uma palavra relacionada à sua dica.
          </small>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
