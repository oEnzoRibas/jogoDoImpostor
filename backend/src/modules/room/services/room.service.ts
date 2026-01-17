import { randomUUID } from "crypto";
import { redisClient } from "../../../config/redis.js";
import { Room, Player, GameState } from "@jdi/shared";
import { getRandomWord, THEMES } from "@jdi/shared/src/themes.js";
import { DEFAULT_MAX_ROUNDS } from "@jdi/shared/src/constants.js";
import { lstat } from "fs";
import { callbackify } from "util";

const ROOM_TTL = 60 * 60 * 2;
const PLAYER_TTL = 60 * 60 * 24;

const KEY_ROOM = "room:";
const KEY_PLAYER_ROOM = "player_room:";
const KEY_CUSTOM_THEMES = "custom_themes:";


interface RoomInternal extends Room {
  secretWord: string;
}

export const RoomService = {
  getRoomIdByPlayer: async (playerId: string): Promise<string> => {
    const roomId = await redisClient.get(`${KEY_PLAYER_ROOM}${playerId}`);
    if (!roomId) {
      throw new Error("Player is not in any room");
    }
    return roomId;
  },

  async create(hostId: string, playerName: string): Promise<Room> {
    const roomId = randomUUID().slice(0, 4).toUpperCase();

    const hostPlayer: Player = {
      id: hostId,
      name: playerName,
      isHost: true,
      isImpostor: false,
    };

    const newRoom: Room = {
      id: roomId,
      gameState: "WAITING" as GameState,
      players: [hostPlayer],
      customThemes: [],
      currentRound: 0,
      maxRounds: DEFAULT_MAX_ROUNDS,
    };

    await redisClient.set(`${KEY_ROOM}${roomId}`, JSON.stringify(newRoom), {
      EX: ROOM_TTL,
    });

    await redisClient.set(`${KEY_PLAYER_ROOM}${hostId}`, roomId, {
      EX: PLAYER_TTL,
    });
    return newRoom;
  },

  async join(
    roomId: string,
    playerId: string,
    playerName: string,
  ): Promise<Room> {
    const roomJson = await redisClient.get(`${KEY_ROOM}${roomId}`);

    if (!roomJson) {
      throw new Error("Sala não encontrada.");
    }

    const room: Room = JSON.parse(roomJson);

    // Bloqueia entrada se o jogo já começou (opcional, mas recomendado)
    if (room.gameState !== "LOBBY" && room.gameState !== "WAITING") {
      throw new Error("O jogo já começou! Espere a próxima rodada.");
    }

    // Cria o jogador novo com o Socket ID atual
    const newPlayer: Player = {
      id: playerId,
      name: playerName,
      isHost: room.players.length === 0, // Se for o primeiro, é Host
      isImpostor: false,
      hasVoted: false,
      wordsList: [],
    };

    room.players.push(newPlayer);

    // Salva o mapeamento Socket -> Sala
    await redisClient.set(`${KEY_PLAYER_ROOM}${playerId}`, roomId, {
      EX: PLAYER_TTL,
    });

    // Salva a sala
    await this.saveRoom(room);

    return room;
  },

  async resetGame(roomId: string): Promise<Room> {
    const roomJson = await redisClient.get(`${KEY_ROOM}${roomId}`);

    if (!roomJson) {
      throw new Error("Room not found");
    }

    const room: Room = JSON.parse(roomJson);

    room.gameState = "WAITING";
    room.currentRound = 0;
    room.turnPlayerId = undefined;
    room.gameResults = undefined;
    room.players = room.players.map((p) => ({
      ...p,
      isImpostor: false,
      hasVoted: false,
      lastWord: undefined,
      wordsList: [],
    }));
    room.votes = {};

    await this.saveRoom(room);
    return room;
  },

  async get(roomId: string): Promise<Room | null> {
    const roomJson = await redisClient.get(`${KEY_ROOM}${roomId}`);

    if (!roomJson) {
      return null;
    }
    const room: Room = JSON.parse(roomJson);
    return room;
  },

  async leave(playerId: string): Promise<Room | null> {
    const roomId = await redisClient.get(`${KEY_PLAYER_ROOM}${playerId}`);

    if (!roomId) return null;

    const roomJson = await redisClient.get(`${KEY_ROOM}${roomId}`);

    if (!roomJson) {
      await redisClient.del(`${KEY_PLAYER_ROOM}${playerId}`);
      return null;
    }

    const room: Room = JSON.parse(roomJson);

    const playerIndex = room.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) {
      await redisClient.del(`${KEY_PLAYER_ROOM}${playerId}`);
      return room;
    }

    const playerToRemove = room.players[playerIndex];
    room.players.splice(playerIndex, 1);

    await redisClient.del(`${KEY_PLAYER_ROOM}${playerId}`);

    if (room.players.length === 0) {
      await redisClient.del(`${KEY_ROOM}${roomId}`);
      await redisClient.del(`${KEY_CUSTOM_THEMES}${roomId}`);
      return null;
    }

    if (playerToRemove.isHost) {
      room.players[0].isHost = true;
    }

    await redisClient.set(`${KEY_ROOM}${roomId}`, JSON.stringify(room), {
      EX: ROOM_TTL,
    });

    return room;
  },

  async delete(roomId: string): Promise<void> {
    await redisClient.del(`${KEY_ROOM}${roomId}`);
  },

  async startGame(
    roomId: string,
    themeName: string,
    maxRounds: number,
  ): Promise<any> {
    const roomJson = await redisClient.get(`${KEY_ROOM}${roomId}`);

    if (!roomJson) {
      throw new Error("Room not found");
    }

    const room: Room = JSON.parse(roomJson);

    let theme = THEMES[themeName];

    if (!theme) {
      const customJson = await redisClient.get(`${KEY_CUSTOM_THEMES}${roomId}`);

      if (customJson) {
        const customThemes = JSON.parse(customJson);
        theme = customThemes[themeName];
      }
    }

    if (!theme || theme.length === 0) {
      throw new Error("Theme not found or has no words");
    }

    const secretWord = theme[Math.floor(Math.random() * theme.length)];

    const impostorIndex = Math.floor(Math.random() * room.players.length);
    const impostorId = room.players[impostorIndex].id;

    room.players = room.players.map((p, index) => ({
      ...p,
      isImpostor: index === impostorIndex,
    }));

    room.gameState = "PLAYING";
    room.currentRound = 1;
    room.maxRounds = maxRounds;

    const starterIndex = Math.floor(Math.random() * room.players.length);

    room.turnPlayerId = room.players[starterIndex].id;

    room.players.forEach((p) => {
      p.lastWord = undefined;
      p.wordsList = [];
    });

    await this.saveRoom(room);

    return { room, secretWord, impostorId };
  },

  async saveRoom(room: Room): Promise<void> {
    await redisClient.set(`${KEY_ROOM}${room.id}`, JSON.stringify(room), {
      EX: ROOM_TTL,
    });
  },

  async submitWord(
    roomId: string,
    playerId: string,
    word: string,
  ): Promise<Room> {
    const room = await this.get(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    if (room.turnPlayerId !== playerId) {
      throw new Error("It's not this your turn");
    }

    const playersIndex = room.players.findIndex((p) => p.id === playerId);
    const player = room.players[playersIndex];

    player.lastWord = word.trim();
    player.wordsList = player.wordsList || [];
    player.wordsList.push(word.trim());

    let nextIndex = playersIndex + 1;
    if (nextIndex >= room.players.length) {
      nextIndex = 0;
    }

    if (
      room.players.every(
        (p) => p.wordsList && p.wordsList.length == room.currentRound,
      )
    ) {
      room.currentRound += 1;
    }

    if (room.currentRound > room.maxRounds) {
      room.gameState = "VOTING";
      room.turnPlayerId = undefined;
    } else {
      room.turnPlayerId = room.players[nextIndex].id;
    }

    await this.saveRoom(room);
    return room;
  },

  async addCustomThemes(
    roomId: string,
    hostId: string,
    customTheme: Record<string, string[]>,
  ): Promise<string[]> {
    const roomJson = await redisClient.get(`${KEY_ROOM}${roomId}`);
    if (roomJson) {
      const room: Room = JSON.parse(roomJson);
      const player = room.players.find((p) => p.id === hostId);
      if (!player?.isHost) {
        throw new Error("Apenas o Host pode adicionar temas.");
      }
    }

    const normalizedTheme = Object.keys(customTheme).reduce(
      (acc, name) => {
        const normalized = name.trim().toUpperCase();

        if (THEMES[normalized]) {
          throw new Error(
            `O tema "${name}" conflita com um tema existente. Por favor, escolha outro nome.`,
          );
        }
        acc[normalized] = customTheme[name];
        return acc;
      },
      {} as Record<string, string[]>,
    );

    if (Object.keys(normalizedTheme).length === 0) {
      throw new Error("Nenhum tema personalizado fornecido.");
    }

    const existingJson = await redisClient.get(`${KEY_CUSTOM_THEMES}${roomId}`);
    let existingThemes: Record<string, string[]> = {};
    if (existingJson) {
      existingThemes = JSON.parse(existingJson);
    }

    const updatedThemes = {
      ...existingThemes,
      ...normalizedTheme,
    };

    await redisClient.set(
      `${KEY_CUSTOM_THEMES}${roomId}`,
      JSON.stringify(updatedThemes),
      { EX: ROOM_TTL },
    );

    return Object.keys(updatedThemes);
  },

  async vote(roomId: string, voterId: string, targetId: string): Promise<Room> {
    console.log("Calculating vote...", { roomId, voterId, targetId });

    const room = await this.get(roomId);
    if (!room) throw new Error("Sala não encontrada");
    if (room.gameState !== "VOTING") throw new Error("Não é hora de votar!");

    room.votes = room.votes || {};
    room.votes[voterId] = targetId;

    const player = room.players.find((p) => p.id === voterId);
    if (player) player.hasVoted = true;

    const totalVotes = Object.keys(room.votes).length;
    const totalPlayers = room.players.length;

    if (totalVotes === totalPlayers) {
      return this.calculateResults(room);
    }

    await this.saveRoom(room);
    return room;
  },

  async calculateResults(room: Room): Promise<Room> {
    room.gameState = "RESULTS";

    const voteCounts: Record<string, number> = {};
    Object.values(room.votes || {}).forEach((targetId) => {
      voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
    });

    let mostVotedId = "";
    let maxVotes = -1;

    Object.entries(voteCounts).forEach(([id, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        mostVotedId = id;
      }
    });

    const impostor = room.players.find((p) => p.isImpostor);

    const crewmatesWon = mostVotedId === impostor?.id;

    room.gameResults = {
      winner: crewmatesWon ? "CREWMATES" : "IMPOSTOR",
      impostorId: impostor?.id || "",
      votes: room.votes || {},
    };

    await this.saveRoom(room);
    return room;
  },
};
