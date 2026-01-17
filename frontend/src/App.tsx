import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { GameProvider, useGame } from "./context/GameContext";

// Imports das telas
import LobbyScreen from "./features/Lobby/LobbyScreen";
import NotFound from "./features/Errors/NotFound";
import WaitingRoomScreen from "./features/WaitingRoom/WaitingRoomScreen";
import GameScreen from "./features/Game/GameScreen";
import ResultsScreen from "./features/Results/ResultsScreen";
import { Toaster } from "react-hot-toast";
import VotingScreen from "./features/Voting/VotingScreen";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  autoConnect: false,
});

function GameManager() {
  const { gameState, connect } = useGame();

  useEffect(() => {
    connect();
  }, []);

  switch (gameState) {
    case "LOBBY":
      return <LobbyScreen />;

    case "WAITING":
      return <WaitingRoomScreen />;

    case "PLAYING":
      return <GameScreen />;

    case "VOTING":
      return <VotingScreen />;

    case "RESULTS":
      return <ResultsScreen />;

    default:
      return <div>Estado desconhecido: {gameState}</div>;
  }
}

export default function App() {
  return (
    <GameProvider>
      <Toaster position="top-center" />
      <GameManager />
    </GameProvider>
  );
}