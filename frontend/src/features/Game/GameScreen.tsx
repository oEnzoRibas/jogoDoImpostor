import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { socketService } from "../../services/socket";
import toast from "react-hot-toast";

// Imports do Design System
import { PageContainer } from "../../components/Page/PageContainer";
import { Card } from "../../components/Card/Card";
import { PrimaryButton } from "../../components/Buttons/PrimaryButton";
import { Input } from "../../components/Input/Input";
import { theme } from "../../styles/theme";
import StartVotingButton from "./components/StartVotingButton.tsx/StartVotingButton";

const GameScreen = () => {
  const { room, me, mySecret } = useGame();
  const [wordInput, setWordInput] = useState("");
  const [hoveredPlayerId, setHoveredPlayerId] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);

  const showStartVotingButton =
    me?.isHost && room?.gameState === "PLAYING" && !room?.turnPlayerId;

  if (!room || !me) return <PageContainer><div>Carregando...</div></PageContainer>;

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

  const handleStartVoting = () => {
    socketService.socket?.emit("start_voting", { roomId: room.id });
  };

  return (
    <PageContainer>
      {/* --- CARTÃO DE IDENTIDADE (Interativo) --- */}
      <div
        onClick={() => setShowSecret(!showSecret)}
        style={{
          cursor: "pointer",
          marginBottom: theme.spacing.xl,
          transform: showSecret ? "scale(1.02)" : "scale(1)",
          transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        }}
      >
        <Card
          style={{
            // Lógica de cores semânticas (Impostor = Vermelho, Inocente = Verde)
            background: isImpostor
              ? `linear-gradient(135deg, ${theme.colors.secondary} 0%, #7f1d1d 100%)`
              : `linear-gradient(135deg, ${theme.colors.primary} 0%, #14532d 100%)`,
            border: `2px solid ${isImpostor ? "#fca5a5" : "#86efac"}`,
            textAlign: "center",
            boxShadow: `0 10px 25px ${isImpostor ? "rgba(239, 68, 68, 0.4)" : "rgba(34, 197, 94, 0.4)"}`,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: theme.fontSize.s,
              color: "rgba(255,255,255,0.8)",
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontWeight: "bold",
            }}
          >
            SUA IDENTIDADE
          </p>

          <div
            style={{
              marginTop: theme.spacing.m,
              minHeight: "60px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {showSecret ? (
              <div style={{ animation: "fadeIn 0.3s" }}>
                {isImpostor ? (
                  <>
                    <span style={{ fontSize: "2rem", display: "block" }}>
                      🕵️‍♂️
                    </span>
                    <span
                      style={{
                        fontSize: theme.fontSize.l,
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
                      VOCÊ É O IMPOSTOR
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        fontSize: theme.fontSize.l,
                        fontWeight: "bold",
                        color: "#fff",
                        display: "block",
                      }}
                    >
                      🤫 Palavra: {mySecret?.word}
                    </span>
                    <span
                      style={{
                        fontSize: theme.fontSize.s,
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      Tema: {mySecret?.theme}
                    </span>
                  </>
                )}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <span style={{ fontSize: "2rem" }}>🔒</span>
                <span
                  style={{
                    fontSize: theme.fontSize.s,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  Toque para revelar
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* --- STATUS DO JOGO --- */}
      <div style={{ textAlign: "center", marginBottom: theme.spacing.l }}>
        <h2
          style={{
            margin: 0,
            fontSize: "1.5rem",
            color: theme.colors.text.primary,
          }}
        >
          Rodada {room.currentRound}{" "}
          <span style={{ color: theme.colors.text.disabled }}>
            / {room.maxRounds}
          </span>
        </h2>
        <p
          style={{
            color: isMyTurn ? theme.colors.accent : theme.colors.text.secondary,
            fontWeight: isMyTurn ? "bold" : "normal",
          }}
        >
          {isMyTurn
            ? "SUA VEZ! Escreva uma dica."
            : `Aguardando: ${room.players.find((p) => p.id === room.turnPlayerId)?.name}...`}
        </p>
      </div>

      {/* --- GRID DE JOGADORES --- */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: theme.spacing.l,
          // Adiciona padding bottom extra para o input fixo não cobrir o último player
          paddingBottom: "120px",
        }}
      >
        {room.players.map((player) => {
          const safeWordsList = player.wordsList || [];
          const isHovered = hoveredPlayerId === player.id;
          const hasWords = safeWordsList.length > 0;
          const lastWord = hasWords
            ? safeWordsList[safeWordsList.length - 1]
            : "";
          const isPlayerTurn = player.id === room.turnPlayerId;

          return (
            <div
              key={player.id}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* BALÃO DE FALA */}
              {hasWords && (
                <div
                  onMouseEnter={() => setHoveredPlayerId(player.id)}
                  onMouseLeave={() => setHoveredPlayerId(null)}
                  onClick={() =>
                    setHoveredPlayerId(isHovered ? null : player.id)
                  } // Funciona no touch também
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    marginBottom: "10px",
                    background: "white",
                    color: "#000",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                    zIndex: 10,
                    cursor: "pointer",
                    minWidth: "60px",
                    textAlign: "center",
                    border: `2px solid ${player.id === me.id ? theme.colors.primary : "#fff"}`,
                  }}
                >
                  {isHovered ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10px",
                          color: "#888",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        HISTÓRICO
                      </span>
                      {safeWordsList.map((w, i) => (
                        <span
                          key={i}
                          style={{
                            color:
                              i === safeWordsList.length - 1 ? "#000" : "#666",
                          }}
                        >
                          {w}
                        </span>
                      ))}
                    </div>
                  ) : (
                    lastWord
                  )}
                  {/* Triângulo do balão */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-6px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 0,
                      height: 0,
                      borderLeft: "6px solid transparent",
                      borderRight: "6px solid transparent",
                      borderTop: "6px solid white",
                    }}
                  />
                </div>
              )}

              {/* AVATAR */}
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: theme.colors.surface,
                  border: isPlayerTurn
                    ? `3px solid ${theme.colors.accent}` // Amarelo se for a vez dele
                    : player.id === me.id
                      ? `3px solid ${theme.colors.primary}`
                      : `3px solid transparent`, // Verde se sou eu
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  fontWeight: "bold",
                  boxShadow: isPlayerTurn
                    ? `0 0 15px ${theme.colors.accent}60`
                    : "none",
                  transition: "all 0.3s",
                }}
              >
                {player.name.charAt(0).toUpperCase()}
              </div>

              <span
                style={{
                  marginTop: "8px",
                  fontSize: theme.fontSize.s,
                  fontWeight: "bold",
                  color: isPlayerTurn
                    ? theme.colors.accent
                    : theme.colors.text.primary,
                }}
              >
                {player.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* --- DOCK DE INPUT (Fixo embaixo) --- */}
      {isMyTurn && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: "0 20px",
            boxSizing: "border-box",
            zIndex: 100,
          }}
        >
          <Card
            style={{
              width: "100%",
              maxWidth: "500px",
              flexDirection: "row",
              display: "flex",
              gap: "10px",
              alignItems: "center",
              padding: "10px",
              borderRadius: "16px",
              boxShadow: "0 -5px 30px rgba(0,0,0,0.5)",
              border: `1px solid ${theme.colors.accent}`,
            }}
          >
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", width: "100%", gap: "10px" }}
            >
              <Input
                placeholder="Escreva uma dica..."
                value={wordInput}
                onChange={(e) => setWordInput(e.target.value)}
                autoFocus
                style={{ marginBottom: 0, flex: 1 }} // Remove margem padrão e expande
              />
              <PrimaryButton type="submit" style={{ padding: "0 20px" }}>
                ENVIAR
              </PrimaryButton>
            </form>
          </Card>
        </div>
      )}

      {/* ... resto da tela do jogo ... */}

      {/* Se o jogo acabou as rodadas, mostra mensagem para os comuns */}
      {!room?.turnPlayerId && !me?.isHost && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <h3>Aguardando o anfitrião iniciar a votação... ⏳</h3>
        </div>
      )}

      {/* Se for Host, mostra o botão */}
      {showStartVotingButton && (
        <StartVotingButton onClick={handleStartVoting} />
      )}
    </PageContainer>
  );
};

export default GameScreen;