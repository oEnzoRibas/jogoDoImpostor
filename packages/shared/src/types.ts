export type GameState =
  | "HOME"
  | "LOBBY"
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
  secretWord?: string;
}

export interface Room {
  id: string;
  players: Player[];

  gameState: GameState;
  customThemes: string[];

  turnPlayerId?: string;
  currentRound: number;
  maxRounds: number;

  gameResults?: GameResults;
  votes?: Record<string, string>; // playerId -> votedPlayerId
}

export interface GameResults {
  winner: "IMPOSTOR" | "CREWMATES";
  impostorId: string;
  votes: Record<string, string>; // playerId -> votedPlayerId~
  word: string;
}

export interface Theme {
  name: string;
  words: string[];
  icon?: string;
}