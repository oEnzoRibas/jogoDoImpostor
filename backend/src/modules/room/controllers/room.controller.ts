import { Socket, Server as SocketIOServer } from "socket.io";
import { RoomService } from "../services/room.service.js";
import { CreateRoomPayload } from "../payloads/CreateRoomPayload.js";
import { JoinRoomPayload } from "../payloads/JoinRoomPayload.js";

export const RoomController = {
  async createRoom(
    io: SocketIOServer,
    socket: Socket,
    payload: CreateRoomPayload,
  ) {
    try {
      console.log(
        `Room Creation requested by User ${payload.playerName} ID: ${socket.id}`,
      );

      const newRoom = await RoomService.createRoom(socket.id, payload.playerName);

      socket.join(newRoom.id);

      io.to(newRoom.id).emit("room_update", newRoom);

      console.log(
        `Room ${newRoom.id} created by User ${payload.playerName} ID: ${socket.id}`,
      );
    } catch (error) {
      console.error(
        `Error creating room for User ${payload.playerName} ID: ${socket.id}:`,
        error,
      );
      socket.emit("room:error", { message: (error as Error).message });
    }
  },

  async joinRoom(io: SocketIOServer, socket: Socket, payload: JoinRoomPayload) {
    try {
      console.log(
        `Join Room requested by User ${payload.playerName} ID: ${socket.id} for Room ${payload.roomId}`,
      );

      const updatedRoom = await RoomService.joinRoom(
        payload.roomId,
        socket.id,
        payload.playerName,
      );

      if (!updatedRoom) {
        throw new Error("Sala não encontrada!");
      }

      socket.join(updatedRoom.id);

      io.to(updatedRoom.id).emit("room_update", updatedRoom);

      console.log(
        `User ${payload.playerName} ID: ${socket.id} joined Room ${payload.roomId}`,
      );
    } catch (error) {
      console.error(
        `Error joining room for User ${payload.playerName} ID: ${socket.id}:`,
        error,
      );
      socket.emit("room:error", { message: (error as Error).message });
    }
  },

  async leaveRoom(io: SocketIOServer, socket: Socket) {
    try {
      console.log(`Leave Room requested by User ID: ${socket.id}`);

      const roomId = await RoomService.getRoomIdByPlayer(socket.id);

      if (!roomId) {
        console.log("User was not in any room.");
        return;
      }

      const updatedRoom = await RoomService.leaveRoom(socket.id);

      if (updatedRoom) {
        if (updatedRoom.gameState === "PLAYING") {
          if (updatedRoom.players.length < 2) {
            updatedRoom.gameState = "LOBBY";
            updatedRoom.turnPlayerId = "";
            updatedRoom.gameResults = undefined;
            updatedRoom.currentRound = 0;

            io.to(updatedRoom.id).emit("toast", {
              type: "error",
              message: "Not enough players. Game ended.",
            });
          } else {
            const currentTurnPlayerExists = updatedRoom.players.find(
              (p) => p.id === updatedRoom.turnPlayerId,
            );

            if (!currentTurnPlayerExists) {
              updatedRoom.turnPlayerId = updatedRoom.players[0].id;

              io.to(updatedRoom.id).emit("toast", {
                type: "info",
                message: "Current player left. Passing turn...",
              });
            }
          }
        }

        socket.leave(updatedRoom.id);

        io.to(updatedRoom.id).emit("room_update", updatedRoom);
      } else {
        socket.leave(roomId);
      }

      console.log(`User ID: ${socket.id} left room ${roomId} successfully.`);
    } catch (error) {
      console.error(`Error leaving room for User ID: ${socket.id}:`, error);
    }
  },

  async resetRoom(io: SocketIOServer, socket: Socket) {
    try {
      console.log(`🔄 Reset Game requested by Host: ${socket.id}`);

      const roomId = await RoomService.getRoomIdByPlayer(socket.id);

      const updatedRoom = await RoomService.resetRoom(roomId);

      io.to(roomId).emit("room_update", updatedRoom);

      console.log(`Game reset for Room ${roomId} by User ID: ${socket.id}`);
    } catch (error) {
      console.error(`Error resetting game for User ID: ${socket.id}:`, error);
      socket.emit("room:error", { message: (error as Error).message });
    }
  },

  async addCustomThemes(
    io: SocketIOServer,
    socket: Socket,
    payload: {
      themes: Record<string, string[]>;
    },
  ) {
    try {
      console.log(`Uploading custom themes by User ID: ${socket.id}`);

      const roomId = await RoomService.getRoomIdByPlayer(socket.id);

      if (!roomId) {
        throw new Error("Player is not in any room");
      }

      const { themes } = payload;

      const allCustomThemes = await RoomService.addCustomThemes(
        roomId,
        socket.id,
        themes,
      );

      io.to(roomId).emit("themes_updated", allCustomThemes);

      console.log(
        `Custom themes uploaded for Room ${roomId} by User ID: ${socket.id}`,
      );

      socket.emit("toast", {
        type: "success",
        message: "Temas personalizados enviados com sucesso!",
      });
    } catch (error) {
      console.error(`Error uploading themes for User ID: ${socket.id}:`, error);
      socket.emit("room:error", { message: (error as Error).message });
    }
  },
};
