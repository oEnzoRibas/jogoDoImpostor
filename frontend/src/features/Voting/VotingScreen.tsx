import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { socketService } from "../../services/socket";

// Imports do Design System
import { PageContainer } from "../../components/Page/PageContainer";
import { PrimaryButton } from "../../components/Buttons/PrimaryButton";
import { theme } from "../../styles/theme";

const VotingScreen = () => {
  const { room, me } = useGame();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  if (!room || !me)
    return (
      <PageContainer>
        <div>Carregando...</div>
      </PageContainer>
    );

  const iHaveVoted = room.players.find((p) => p.id === me.id)?.hasVoted;

  const handleConfirmVote = () => {
    if (!selectedPlayerId) return;
    socketService.socket?.emit("submit_vote", { targetId: selectedPlayerId });
  };

  return (
    <PageContainer>
      {/* CABEÇALHO */}
      <div style={{ textAlign: "center", marginBottom: theme.spacing.xl }}>
        <h1
          style={{
            color: theme.colors.secondary, // Vermelho
            fontSize: "2.5rem",
            marginBottom: theme.spacing.s,
            textTransform: "uppercase",
            letterSpacing: "2px",
            // Animação de pulso para gerar tensão
            animation: "pulseRed 2s infinite",
          }}
        >
          QUEM É O IMPOSTOR? 🕵️
        </h1>
        <style>{`
          @keyframes pulseRed {
            0% { text-shadow: 0 0 0 rgba(239, 68, 68, 0); }
            50% { text-shadow: 0 0 20px rgba(239, 68, 68, 0.5); }
            100% { text-shadow: 0 0 0 rgba(239, 68, 68, 0); }
          }
        `}</style>

        <p
          style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSize.m,
          }}
        >
          {iHaveVoted
            ? "Voto computado. Aguardando os outros jogadores..."
            : "Clique no suspeito para confirmar seu voto."}
        </p>
      </div>

      {/* GRID DE JOGADORES */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: theme.spacing.xl, // Espaçamento maior para evitar cliques errados
          marginBottom: theme.spacing.xl,
        }}
      >
        {room.players.map((player) => {
          const isSelected = selectedPlayerId === player.id;
          const isMe = player.id === me.id;

          // Se eu já votei, diminuo a opacidade de quem não foi meu alvo
          // Se eu não votei, opacity normal
          const opacity = iHaveVoted ? (isSelected ? 1 : 0.3) : 1;

          return (
            <div
              key={player.id}
              onClick={() => {
                if (!iHaveVoted && !isMe) setSelectedPlayerId(player.id);
              }}
              style={{
                cursor: iHaveVoted || isMe ? "default" : "pointer",
                opacity: opacity,
                transform: isSelected ? "scale(1.15)" : "scale(1)",
                transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Avatar Container */}
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  // Fica vermelho se selecionado, senão cinza escuro
                  background: isSelected
                    ? theme.colors.secondary
                    : theme.colors.surface,
                  border: isSelected
                    ? `4px solid #fff`
                    : `4px solid transparent`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "40px",
                  position: "relative",
                  boxShadow: isSelected
                    ? `0 0 20px ${theme.colors.secondary}` // Brilho vermelho intenso
                    : "0 4px 10px rgba(0,0,0,0.3)",
                }}
              >
                {player.name.charAt(0).toUpperCase()}

                {/* Badge de "Já Votou" (Check Verde) */}
                {player.hasVoted && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background: theme.colors.primary,
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      border: `3px solid ${theme.colors.background}`, // Borda da cor do fundo para separar
                      boxShadow: "0 2px 5px rgba(0,0,0,0.5)",
                    }}
                    title="Este jogador já votou"
                  >
                    ✅
                  </div>
                )}
              </div>

              <span
                style={{
                  marginTop: theme.spacing.s,
                  fontWeight: "bold",
                  fontSize: theme.fontSize.m,
                  color: isSelected
                    ? theme.colors.secondary
                    : theme.colors.text.primary,
                  textShadow: isSelected
                    ? "0 0 10px rgba(239,68,68,0.5)"
                    : "none",
                }}
              >
                {player.name} {isMe && "(Você)"}
              </span>
            </div>
          );
        })}
      </div>

      {/* BOTÃO DE CONFIRMAR */}
      {!iHaveVoted && (
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <PrimaryButton
            onClick={handleConfirmVote}
            disabled={!selectedPlayerId}
            variant="secondary" // Vermelho para ação de "Matar/Votar"
            style={{
              padding: "15px 60px",
              borderRadius: "50px",
              fontSize: "1.2rem",
              boxShadow: selectedPlayerId
                ? `0 4px 20px ${theme.colors.secondary}60`
                : "none",
            }}
          >
            VOTAR AGORA 🔪
          </PrimaryButton>
        </div>
      )}
    </PageContainer>
  );
};

export default VotingScreen;
