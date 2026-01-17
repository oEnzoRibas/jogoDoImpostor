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
  lastWord?: string;
  wordsList?: string[];
  hasVoted?: boolean;
}

export interface Room {
  id: string;
  players: Player[];
  gameState: GameState;
  customThemes: string[];
  currentRound: number;
  maxRounds: number;
  turnPlayerId?: string;
  gameResults?: GameResults;
  votes?: Record<string, string>; // playerId -> votedPlayerId
}


export interface GameResults {
  winner: "IMPOSTOR" | "CREWMATES";
  impostorId: string;
  votes: Record<string, string>; // playerId -> votedPlayerId
}