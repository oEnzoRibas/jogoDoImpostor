import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { socketService } from "../../services/socket";

// Imports do Design System
import { PageContainer } from "../../components/Page/PageContainer";
import ConfirmVoteButton from "./ConfirmVoteButton/ConfirmVoteButton";
import VotingHeader from "./VotingHeader/VotingHeader";
import VotingPlayerList from "./VotingPlayerList/VotingPlayerList";

const VotingScreen = () => {
  const { room, me } = useGame();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  if (!room || !me)
    return (
      <PageContainer>
        <div>Loading...</div>
      </PageContainer>
    );

  const iHaveVoted =
    room.players.find((p) => p.id === me.id)?.hasVoted ?? false;

  const handleConfirmVote = () => {
    if (!selectedPlayerId) return;
    socketService.socket?.emit("submit_vote", { targetId: selectedPlayerId });
  };

  return (
    <PageContainer>
      {/* HEADER */}

      <VotingHeader iHaveVoted={!iHaveVoted}></VotingHeader>

      {/* PLAYERS GRID */}
      <VotingPlayerList
        room={room}
        selectedPlayerId={selectedPlayerId}
        setSelectedPlayerId={setSelectedPlayerId}
        me={me}
        iHaveVoted={iHaveVoted}
      />

      {/* CONFIRM BUTTON */}
      {!iHaveVoted && (
        <ConfirmVoteButton
          handleConfirmVote={handleConfirmVote}
          selectedPlayerId={selectedPlayerId}
        />
      )}
    </PageContainer>
  );
};

export default VotingScreen;
