import { KEY_CUSTOM_THEMES, KEY_ROOM } from "@jdi/shared/src/constants.js";
import { redisClient } from "../../../config/redis.js";
import { Room } from "@jdi/shared";
import { THEMES } from "@jdi/shared/src/themes.js";
import { RoomService } from "../../room/services/room.service.js";

export const GameService = {
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

    const standardThemeObj = THEMES.find((t) => t.name === themeName);

    let words: string[] | undefined = standardThemeObj?.words;

    if (!words) {
      const customJson = await redisClient.get(`${KEY_CUSTOM_THEMES}${roomId}`);

      if (customJson) {
        const customThemes = JSON.parse(customJson);
        words = customThemes[themeName];
      }
    }

    if (!words) {
      throw new Error(`Theme '${themeName}' not found`);
    }

    if (words.length === 0) {
      throw new Error("Theme has no words");
    }

    const secretWord = words[Math.floor(Math.random() * words.length)];

    const impostorIndex = Math.floor(Math.random() * room.players.length);
    const impostorId = room.players[impostorIndex].id;

    room.players = room.players.map((p, index) => ({
      ...p,
      isImpostor: index === impostorIndex,
      secretWord:
        index === impostorIndex ? "You are the Impostor!" : secretWord,
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

    await RoomService.saveRoom(room);

    return { room, secretWord, impostorId };
  },

  async vote(roomId: string, voterId: string, targetId: string): Promise<Room> {
    console.log("Calculating vote...", { roomId, voterId, targetId });

    const room = await RoomService.getRoom(roomId);
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

    await RoomService.saveRoom(room);
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

    let crewmatesWon = mostVotedId === impostor?.id;

    const civilian = room.players.find((p) => !p.isImpostor);
    const finalWord = civilian?.secretWord || "Unknown";

    if (
      Object.values(voteCounts).filter((count) => count === maxVotes).length > 1
    ) {
      crewmatesWon = false;
    }

    room.gameResults = {
      winner: crewmatesWon ? "CREWMATES" : "IMPOSTOR",
      impostorId: impostor?.id || "",
      votes: room.votes || {},
      word: finalWord,
    };

    await RoomService.saveRoom(room);
    return room;
  },

  async submitWord(
    roomId: string,
    playerId: string,
    word: string,
  ): Promise<Room> {
    const room = await RoomService.getRoom(roomId);
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
      room.turnPlayerId = undefined;
    } else {
      room.turnPlayerId = room.players[nextIndex].id;
    }

    await RoomService.saveRoom(room);
    return room;
  },

  async startVoting(roomId: string, playerId: string): Promise<Room> {
    const room = await RoomService.getRoom(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    const player = room.players.find((p) => p.id === playerId);
    if (!player?.isHost) {
      throw new Error("Only host can start voting");
    }

    room.gameState = "VOTING";
    room.turnPlayerId = undefined;

    room.votes = {};
    room.players.forEach((p) => {
      p.hasVoted = false;
    });

    await RoomService.saveRoom(room);
    return room;
  },
};
