import { useGame } from "../../context/GameContext";

// Imports do Design System
import { PageContainer } from "../../components/Page/PageContainer";
import { PrimaryButton } from "../../components/Buttons/PrimaryButton";
import { theme } from "../../styles/theme";
import VotingResultsCard from "./VotingResultsCard/VotingResultsCard";
import WinnerText from "./WinnerText/WinnerText";
import MatchDetailsBox from "./MatchDetailsBox/MatchDetailsBox";

const ResultsScreen = () => {
  const { room, me, resetGame, leaveRoom } = useGame();

  if (!room || !room.gameResults)
    return (
      <PageContainer>
        <div>Calculating results...</div>
      </PageContainer>
    );

  const { winner, impostorId, votes } = room.gameResults;

  const impostorWon = winner === "IMPOSTOR";
  const iWon =
    (impostorWon && me?.isImpostor) || (!impostorWon && !me?.isImpostor);
  const impostorName =
    room.players.find((p) => p.id === impostorId)?.name || "Unknown";

  const resultColor = impostorWon
    ? theme.colors.secondary
    : theme.colors.primary;

  const pageBackground = `radial-gradient(circle at center, ${resultColor}40 0%, #000000 100%)`;

  return (
    <PageContainer>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: pageBackground,
          zIndex: -1,
          pointerEvents: "none",
        }}
      />

      <WinnerText
        impostorWon={impostorWon}
        iWon={iWon}
        resultColor={resultColor}
      ></WinnerText>

      {/* Impostor Name and Word Cards*/}

      <MatchDetailsBox
        impostorName={impostorName}
        word={room.gameResults.word}
      ></MatchDetailsBox>

      <VotingResultsCard
        room={room}
        votes={votes}
        impostorId={impostorId}
      ></VotingResultsCard>

      <div
        style={{
          display: "flex",
          gap: theme.spacing.m,
          marginTop: theme.spacing.l,
          justifyContent: "center",
        }}
      >
        <PrimaryButton
          variant="secondary"
          onClick={leaveRoom}
          style={{
            background: "transparent",
            border: `1px solid ${theme.colors.secondary}`,
            color: theme.colors.secondary,
          }}
        >
          LEAVE ❌
        </PrimaryButton>

        {me?.isHost && (
          <PrimaryButton
            onClick={resetGame}
            style={{
              background: "white",
              color: "black",
              boxShadow: "0 0 15px rgba(255,255,255,0.3)",
            }}
          >
            PLAY AGAIN 🔄
          </PrimaryButton>
        )}
      </div>
    </PageContainer>
  );
};

export default ResultsScreen;
