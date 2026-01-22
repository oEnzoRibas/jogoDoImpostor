import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import { Toaster } from "react-hot-toast";

// Context
import { GameProvider, useGame } from "./context/GameContext";

// Screens
import HomeScreen from "./features/Home/HomeScreen";
import LobbyScreen from "./features/Lobby/LobbyScreen";
import GameScreen from "./features/Game/GameScreen";
import VotingScreen from "./features/Voting/VotingScreen";
import ResultsScreen from "./features/Results/ResultsScreen";
import { NotFoundScreen } from "./features/Errors/NotFoundScreen";
import { SomeThingUnexpected } from "./features/Errors/SomeThingUnexpected";
import { ErrorBoundary } from "react-error-boundary";
import Loading from "./components/Loading/Loading";

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
      document.title = "Impostors Game!";
      return <HomeScreen />;
    case "LOBBY":
      document.title = "Lobby - Impostors Game!";
      return <LobbyScreen />;
    case "PLAYING":
      document.title = "Playing - Impostors Game!";
      return <GameScreen />;
    case "VOTING":
      document.title = "Voting - Impostors Game!";
      return <VotingScreen />;
    case "RESULTS":
      document.title = "Results - Impostors Game!";
      return <ResultsScreen />;
    default:
      document.title = "Something Unexpected - Impostors Game!";
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
            <Route path="/" element={<GameFlowManager />} />

            <Route path="/Error500" element={<SomeThingUnexpected />} />

            <Route path="Loading" element={<Loading></Loading>}></Route>

            <Route path="*" element={<NotFoundScreen />} />
          </Routes>
        </ErrorBoundary>
      </GameProvider>
    </BrowserRouter>
  );
}
