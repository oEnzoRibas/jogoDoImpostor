import { randomUUID } from "crypto";
import { redisClient } from "../../../config/redis.js";
import { Room, Player, GameState } from "@jdi/shared";
import { THEMES } from "@jdi/shared/src/themes.js";
import {
  DEFAULT_MAX_ROUNDS,
  KEY_CUSTOM_THEMES,
  KEY_PLAYER_ROOM,
  KEY_ROOM,
  PLAYER_TTL,
  ROOM_TTL,
} from "@jdi/shared/src/constants.js";


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

  async createRoom(hostId: string, playerName: string): Promise<Room> {
    const roomId = randomUUID().slice(0, 4).toUpperCase();

    const hostPlayer: Player = {
      id: hostId,
      name: playerName,
      isHost: true,
      isImpostor: false,
    };

    const newRoom: Room = {
      id: roomId,
      gameState: "LOBBY" as GameState,
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

  async joinRoom(
    roomId: string,
    playerId: string,
    playerName: string,
  ): Promise<Room> {
    const roomJson = await redisClient.get(`${KEY_ROOM}${roomId}`);

    if (!roomJson) {
      throw new Error("Sala não encontrada.");
    }

    const room: Room = JSON.parse(roomJson);

    if (room.gameState !== "HOME" && room.gameState !== "LOBBY") {
      throw new Error("O jogo já começou! Espere a próxima rodada.");
    }

    const newPlayer: Player = {
      id: playerId,
      name: playerName,
      isHost: room.players.length === 0, 
      isImpostor: false,
      hasVoted: false,
      wordsList: [],
    };

    room.players.push(newPlayer);

    await redisClient.set(`${KEY_PLAYER_ROOM}${playerId}`, roomId, {
      EX: PLAYER_TTL,
    });

    await this.saveRoom(room);

    return room;
  },

  async resetRoom(roomId: string): Promise<Room> {
    const roomJson = await redisClient.get(`${KEY_ROOM}${roomId}`);

    if (!roomJson) {
      throw new Error("Room not found");
    }

    const room: Room = JSON.parse(roomJson);

    room.gameState = "LOBBY";
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

  async getRoom(roomId: string): Promise<Room | null> {
    const roomJson = await redisClient.get(`${KEY_ROOM}${roomId}`);

    if (!roomJson) {
      return null;
    }
    const room: Room = JSON.parse(roomJson);
    return room;
  },

  async leaveRoom(socketId: string): Promise<Room | null> {
    const roomId = await this.getRoomIdByPlayer(socketId);
    if (!roomId) return null;

    const roomStr = await redisClient.get(`${KEY_ROOM}${roomId}`);
    if (!roomStr) return null;
    const room: Room = JSON.parse(roomStr);

    const playerIndex = room.players.findIndex((p) => p.id === socketId);
    if (playerIndex === -1) return null;

    const playerToRemove = room.players[playerIndex];
    const wasItHisTurn = room.turnPlayerId === socketId;

    room.players.splice(playerIndex, 1);
    await redisClient.del(`${KEY_PLAYER_ROOM}${socketId}`);
    if (room.players.length === 0) {
      await redisClient.del(`${KEY_ROOM}${roomId}`);
      return null;
    }

    if (playerToRemove.isHost) {
      room.players[0].isHost = true;
    }

    if (room.gameState === "PLAYING") {
      if (room.players.length < 2) {
        room.gameState = "HOME";
        room.turnPlayerId = "";
        room.gameResults = undefined;
        room.currentRound = 0;
      } else if (wasItHisTurn) {
        let nextIndex = playerIndex;
        if (nextIndex >= room.players.length) {
          nextIndex = 0;
        }
        room.turnPlayerId = room.players[nextIndex].id;
      }
    }

    await this.saveRoom(room);
    return room;
  },

  async deleteRoom(roomId: string): Promise<void> {
    await redisClient.del(`${KEY_ROOM}${roomId}`);
  },

  async saveRoom(room: Room): Promise<void> {
    await redisClient.set(`${KEY_ROOM}${room.id}`, JSON.stringify(room), {
      EX: ROOM_TTL,
    });
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
        throw new Error("Only the Host can add themes.");
      }
    }

    const normalizedTheme = Object.keys(customTheme).reduce(
      (acc, name) => {
        const normalized = name.trim().toUpperCase();

        if (THEMES[normalized as keyof typeof THEMES]) {
          throw new Error(
            `The theme "${name}" conflicts with an existing theme. Please choose another name.`,
          );
        }
        acc[normalized] = customTheme[name];
        return acc;
      },
      {} as Record<string, string[]>,
    );

    if (Object.keys(normalizedTheme).length === 0) {
      throw new Error("No custom themes provided.");
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
};
