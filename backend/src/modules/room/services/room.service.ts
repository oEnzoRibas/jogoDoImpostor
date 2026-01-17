import { randomUUID } from "crypto";
import { redisClient } from "../../../config/redis.js";
import { Room, Player, GameState } from "@jdi/shared";
import { getRandomWord, THEMES } from "@jdi/shared/src/themes.js";

const ROOM_TTL = 60 * 60 * 2;
const PLAYER_TTL = 60 * 60 * 24;

const KEY_ROOM = "room:";
const KEY_PLAYER_ROOM = "player_room:";
const KEY_CUSTOM_THEMES = "custom_themes:";

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
      return new Error("Room not found") as any;
    }

    const room: Room = JSON.parse(roomJson);

    if (room.gameState !== "LOBBY" && room.gameState !== "WAITING") {
      throw new Error("Cannot join a game in progress");
    }

    if (room.players.some((p) => p.id === playerId)) {
      throw new Error("Player already in the room");
    }

    const newPlayer: Player = {
      id: playerId,
      name: playerName,
      isHost: false,
      isImpostor: false,
    };

    room.players.push(newPlayer);

    await redisClient.set(`${KEY_ROOM}${roomId}`, JSON.stringify(room), {
      EX: ROOM_TTL,
    });

    await redisClient.set(`${KEY_PLAYER_ROOM}${playerId}`, roomId, {
      EX: PLAYER_TTL,
    });

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

  async startGame(roomId: string, themeName: string): Promise<any> {
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

    await redisClient.set(`${KEY_ROOM}${roomId}`, JSON.stringify(room), {
      EX: ROOM_TTL,
    });

    return { room, secretWord, impostorId };
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
};
