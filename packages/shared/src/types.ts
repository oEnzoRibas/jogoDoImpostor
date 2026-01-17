export type GameState =
  | "LOBBY"
  | "WAITING"
  | "ROULETTE"
  | "PLAYING"
  | "VOTING"
  | "RESULTS"
  | "LOADING";

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  isImpostor: boolean;
}

export interface Room {
  id: string;
  players: Player[];
  gameState: GameState;
  customThemes: string[];
}

export interface GameSettings {
  theme: string;
  roundTime: number;
}

export interface GameResults {
  winner: "IMPOSTOR" | "CREWMATES";
  impostorId: string;
  votes: Record<string, string>; // playerId -> votedPlayerId
}