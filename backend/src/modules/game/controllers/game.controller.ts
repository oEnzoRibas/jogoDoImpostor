import { Socket, Server as SocketIOServer } from "socket.io";
import { RoomService } from "../../room/services/room.service.js";
import { GameService } from "../services/game.service.js";
import { StartGamePayload } from "../payloads/StartGamePayload.js";
import { DEFAULT_MAX_ROUNDS } from "@jdi/shared/src/constants.js";
import { Player } from "@jdi/shared";

export const GameController = {
  async startGame(
    io: SocketIOServer,
    socket: Socket,
    payload: StartGamePayload,
  ) {
    try {
      console.log(`Start Game requested by User ID: ${socket.id}`);

      if (!payload.themeName) {
        throw new Error("Theme must be provided to start the game");
      }

      const roomId = await RoomService.getRoomIdByPlayer(socket.id);

      if (!roomId) {
        throw new Error("Player is not in any room");
      }

      console.log(
        `🎮 Starting New Game in Room ${roomId} with theme ${payload.themeName}`,
      );

      const { room, secretWord, impostorId } = await GameService.startGame(
        roomId,
        payload.themeName,
        payload.maxRounds ?? DEFAULT_MAX_ROUNDS,
      );

      room.players.forEach((player: Player) => {
        const isImpostor = player.id === impostorId;

        const secretPayload = {
          role: isImpostor ? "IMPOSTOR" : "PLAYER",
          word: isImpostor ? "You are the Impostor!" : secretWord,
          theme: payload.themeName,
        };

        io.to(player.id).emit("game_start", secretPayload);
      });

      io.to(roomId).emit("room_update", room);
    } catch (error) {
      console.error(error);
      socket.emit("room:error", { message: (error as Error).message });
    }
  },

  async submitWord(
    io: SocketIOServer,
    socket: Socket,
    payload: { word: string },
  ) {
    try {
      const roomId = await RoomService.getRoomIdByPlayer(socket.id);

      if (!roomId) {
        throw new Error("Player is not in any room");
      }

      const updatedRoom = await GameService.submitWord(
        roomId,
        socket.id,
        payload.word,
      );

      io.to(roomId).emit("room_update", updatedRoom);

      socket.emit("toast", {
        type: "success",
        message: "Word submitted successfully!",
      });

      socket.emit("toast", {
        type: "info",
        message: `Waiting for other players to submit their words...`,
      });

      console.log(
        `🔄 Turn passed. It's now the turn of: ${updatedRoom.turnPlayerId}`,
      );

      console.log(`Word submitted for Room ${roomId} by User ID: ${socket.id}`);
    } catch (error) {
      console.error(`Error submitting word for User ID: ${socket.id}:`, error);
      socket.emit("room:error", { message: (error as Error).message });
    }
  },

  async submitVote(
    io: SocketIOServer,
    socket: Socket,
    payload: {
      targetId: string;
    },
  ): Promise<void> {
    try {
      const roomId = await RoomService.getRoomIdByPlayer(socket.id);

      if (!roomId) {
        throw new Error("Player is not in any room");
      }

      const updatedRoom = await GameService.vote(
        roomId,
        socket.id,
        payload.targetId,
      );

      io.to(roomId).emit("room_update", updatedRoom);

      console.log(
        `Vote submitted for Room ${roomId} by User ID: ${socket.id} for Target ID: ${payload.targetId}`,
      );

      socket.emit("toast", {
        type: "success",
        message: "Vote submitted successfully!",
      });

      return;
    } catch (error) {
      console.error(`Error submitting vote for User ID: ${socket.id}:`, error);
      socket.emit("room:error", { message: (error as Error).message });
    }
  },

  async startVoting(
    io: SocketIOServer,
    socket: Socket,
    payload: {},
  ): Promise<void> {
    try {
      const roomId = await RoomService.getRoomIdByPlayer(socket.id);

      if (!roomId) {
        throw new Error("Player is not in any room");
      }

      const updatedRoom = await GameService.startVoting(roomId, socket.id);

      io.to(roomId).emit("room_update", updatedRoom);

      console.log(
        `🗳️ Voting started for Room ${roomId} by User ID: ${socket.id}`,
      );

      io.to(roomId).emit("toast", {
        type: "info",
        message: "Voting has started! Please submit your votes.",
      });

      return;
    } catch (error) {
      console.error(`Error starting voting for User ID: ${socket.id}:`, error);
      socket.emit("room:error", { message: (error as Error).message });
    }
  },
};
