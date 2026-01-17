import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import type { GameState, Room, Player } from "@jdi/shared/";
import { socketService } from "../services/socket";

interface SecretData {
  role: string;
  word: string;
  theme: string;
}

interface GameContextData {
  gameState: GameState;
  room: Room | null;
  me: Player | null;
  isConnected: boolean;
  mySecret: SecretData | null;
  connect: () => void;
  disconnect: () => void;
  createRoom: (playerName: string) => void;
  joinRoom: (roomId: string, playerName: string) => void;
  leaveRoom: () => void;
  startGame: (theme: string, maxRounds?: number) => void;
  resetGame: () => void;
}

const GameContext = createContext({} as GameContextData);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>("LOBBY");
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [me, setMe] = useState<Player | null>(null);
  const [mySecret, setMySecret] = useState<SecretData | null>(null);

  useEffect(() => {
    // Conecta assim que abre o site
    const socket = socketService.connect();

    const handleConnect = () => {
      console.log("✅ Conectado!", socket?.id);
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log("❌ Desconectado");
      setIsConnected(false);
      setGameState("LOBBY");
      setRoom(null);
      setMe(null);
      setMySecret(null);
    };

    const handleRoomUpdate = (updatedRoom: Room) => {
      // Verifica se estou na sala
      const amIInTheRoom = updatedRoom.players.some((p) => p.id === socket.id);

      if (!amIInTheRoom) {
        setRoom(null);
        setGameState("LOBBY");
        setMe(null);
        setMySecret(null);
        return;
      }

      setRoom(updatedRoom);
      setGameState(updatedRoom.gameState);

      const myPlayer = updatedRoom.players.find((p) => p.id === socket.id);
      setMe(myPlayer || null);

      // Limpa segredo se voltar pro Lobby
      if (updatedRoom.gameState === "WAITING") {
        setMySecret(null);
      }
    };

    const handleGameStart = (secretData: SecretData) => {
      console.log("🤫 Segredo recebido:", secretData);
      setMySecret(secretData);
      toast("O Jogo Começou!", { icon: "🎮" });
    };

    const handleError = (error: { message: string }) => {
      toast.error(error.message);
    };

    if (socket) {
      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("room_update", handleRoomUpdate);
      socket.on("game_start", handleGameStart);
      socket.on("room:error", handleError);
    }

    return () => {
      if (socket) {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("room_update", handleRoomUpdate);
        socket.off("game_start", handleGameStart);
        socket.off("room:error", handleError);
      }
    };
  }, []);

  // --- AÇÕES ---

  const connect = () => {
    if (!socketService.socket?.connected) socketService.connect();
  };

  const disconnect = () => {
    socketService.disconnect();
  };

  const createRoom = (playerName: string) => {
    socketService.socket?.emit("create_room", { playerName });
  };

  const joinRoom = (roomId: string, playerName: string) => {
    socketService.socket?.emit("join_room", { roomId, playerName });
  };

  const leaveRoom = () => {
    socketService.socket?.emit("leave_room");
    setRoom(null);
    setGameState("LOBBY");
    setMe(null);
    setMySecret(null);
  };

  const startGame = (theme: string, maxRounds?: number) => {
    socketService.socket?.emit("start_game", { theme, maxRounds });
  };

  const resetGame = () => {
    socketService.socket?.emit("reset_game");
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        room,
        me,
        isConnected,
        mySecret,
        connect,
        disconnect,
        createRoom,
        joinRoom,
        leaveRoom,
        startGame,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);