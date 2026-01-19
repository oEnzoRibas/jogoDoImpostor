import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import { Toaster } from "react-hot-toast";

// Context
import { GameProvider, useGame } from "./context/GameContext";

// Telas
import HomeScreen from "./features/Home/HomeScreen";
import LobbyScreen from "./features/Lobby/LobbyScreen";
import GameScreen from "./features/Game/GameScreen";
import VotingScreen from "./features/Voting/VotingScreen";
import ResultsScreen from "./features/Results/ResultsScreen";
import { NotFoundScreen } from "./features/Errors/NotFoundScreen";
import { SomeThingUnexpected } from "./features/Errors/SomeThingUnexpected";
import { ErrorBoundary } from "react-error-boundary";

// Socket Singleton
export const socket = io(
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
  {
    autoConnect: false,
  },
);

function GameFlowManager() {
  const { gameState, connect } = useGame();

  useEffect(() => {
    connect();
  }, []);

  switch (gameState) {
    case "HOME":
      return <HomeScreen />;
    case "LOBBY":
      return <LobbyScreen />;
    case "PLAYING":
      return <GameScreen />;
    case "VOTING":
      return <VotingScreen />;
    case "RESULTS":
      return <ResultsScreen />;
    default:
      return <SomeThingUnexpected />;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <Toaster position="top-center" />

        <ErrorBoundary
          FallbackComponent={SomeThingUnexpected}
          onReset={() => {
            window.location.href = "/";
          }}
        >
          <Routes>
            {/* Rota Principal: O Gerenciador de Estados do Jogo */}
            <Route path="/" element={<GameFlowManager />} />

            {/* Rota Wildcard (*): Captura qualquer URL errada e mostra o 404 */}
            <Route path="*" element={<NotFoundScreen />} />
          </Routes>
        </ErrorBoundary>
      </GameProvider>
    </BrowserRouter>
  );
}
