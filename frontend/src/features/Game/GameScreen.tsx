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
import StartVotingButton from "./components/VotingSection.tsx/StartVotingButton.tsx/StartVotingButton";
import SendWordInput from "./components/SendWordInput.tsx/SendWordInput";
import WordsBalloon from "./components/Words/WordsBalloon";
import Avatar from "./components/Avatar/Avatar";

const GameScreen = () => {
  const { room, me, mySecret } = useGame();
  const [wordInput, setWordInput] = useState("");
  const [hoveredPlayerId, setHoveredPlayerId] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);

  const showStartVotingButton =
    me?.isHost && room?.gameState === "PLAYING" && !room?.turnPlayerId;

  if (!room || !me)
    return (
      <PageContainer>
        <div>Loading...</div>
      </PageContainer>
    );

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
                      YOU ARE THE IMPOSTOR
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
                      🤫 Word: {mySecret?.word}
                    </span>
                    <span
                      style={{
                        fontSize: theme.fontSize.s,
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      Theme: {mySecret?.theme}
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
                  Tap to reveal
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* --- GAME STATUS --- */}
      <div style={{ textAlign: "center", marginBottom: theme.spacing.l }}>
        <h2
          style={{
            margin: 0,
            fontSize: "1.5rem",
            color: theme.colors.text.primary,
          }}
        >
          Round {room.currentRound}{" "}
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
            ? "YOUR TURN! Write a hint."
            : `Waiting: ${room.players.find((p) => p.id === room.turnPlayerId)?.name}...`}
        </p>
      </div>

      {/* --- PLAYERS GRID --- */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: theme.spacing.xl,
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
                gap: "8px",
              }}
            >
              {hasWords && (
                <WordsBalloon
                  player={player}
                  me={me}
                  wordsList={safeWordsList}
                  lastWord={lastWord}
                  isHovered={isHovered}
                  theme={theme}
                  setHoveredPlayerId={setHoveredPlayerId}
                />
              )}

              {/* AVATAR */}
              <Avatar player={player} me={me} isPlayerTurn={isPlayerTurn} />
            </div>
          );
        })}
      </div>

      {/* --- DOCK DE INPUT (Fixo embaixo) --- */}
      {isMyTurn && (
        <SendWordInput
          wordInput={wordInput}
          setWordInput={setWordInput}
          handleSubmit={handleSubmit}
        />
      )}

      {/* If the game ended the rounds, show message for the common players */}
      {!room?.turnPlayerId && !me?.isHost && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <h3>Waiting for the host to start the voting... ⏳</h3>
        </div>
      )}

      {/* If Host, show the button */}
      {showStartVotingButton && (
        <StartVotingButton onClick={handleStartVoting} />
      )}
    </PageContainer>
  );
};

export default GameScreen;