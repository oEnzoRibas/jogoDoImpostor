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

interface GameContextData {
  gameState: GameState;
  room: Room | null;
  me: Player | null;
  isConnected: boolean;
  
  // Ações
  connect: () => void;
  disconnect: () => void;
  createRoom: (playerName: string) => void;
  joinRoom: (roomId: string, playerName: string) => void;
  leaveRoom: () => void;
  startGame: (theme: string) => void;
  mySecret: { role: string; word: string; theme: string } | null;
}

const GameContext = createContext({} as GameContextData);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>("LOBBY");
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [me, setMe] = useState<Player | null>(null);
  
  // Estado para guardar o segredo recebido do backend
  const [mySecret, setMySecret] = useState<{ role: string; word: string; theme: string } | null>(null);

  useEffect(() => {
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
      // 🛡️ Segurança: Se eu não estou na lista, fui kickado ou saí
      const amIInTheRoom = updatedRoom.players.some((p) => p.id === socket.id);

      if (!amIInTheRoom) {
        setRoom(null);
        setGameState("LOBBY");
        setMe(null);
        return;
      }

      setRoom(updatedRoom);
      setGameState(updatedRoom.gameState);

      const myPlayer = updatedRoom.players.find((p) => p.id === socket.id);
      setMe(myPlayer || null);
    };

    // 👇 OUVINTE DO SEGREDO (INÍCIO DO JOGO)
    const handleGameStart = (secretData: any) => {
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
      socket.on("game_start", handleGameStart); // Registra o ouvinte
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
    setGameState("LOBBY");
    setRoom(null);
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

  const startGame = (theme: string) => {
    if (!theme) {
      toast.error("Erro: Nenhum tema selecionado.");
      return;
    }
    console.log("🚀 Iniciando jogo com tema:", theme);
    socketService.socket?.emit("start_game", { theme });
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        room,
        me,
        isConnected,
        mySecret, // Exposto para a tela do jogo usar depois
        connect,
        disconnect,
        createRoom,
        joinRoom,
        leaveRoom,
        startGame, 
        // Removi chooseTheme pois é melhor controlar isso localmente no componente
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);