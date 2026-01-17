import { Socket, Server as SocketIOServer } from "socket.io";
import { RoomService } from "../services/room.service.js";
import { Player } from "@jdi/shared";

interface CreateRoomPayload {
  playerName: string;
}

interface JoinRoomPayload {
  roomId: string;
  playerName: string;
} 

interface StartGamePayload {
  theme: string;
}

export const registerRoomHandlers = (io: SocketIOServer, socket: Socket) => {
  const createRoomHandler = async (payload: CreateRoomPayload) => {
    try {
      console.log(
        `Room Creation requested by User ${payload.playerName} ID: ${socket.id}`
      );

      const newRoom = await RoomService.create(socket.id, payload.playerName);

      socket.join(newRoom.id);

      io.to(newRoom.id).emit("room_update", newRoom);

      console.log(
        `Room ${newRoom.id} created by User ${payload.playerName} ID: ${socket.id}`
      );
    } catch (error) {
      console.error(
        `Error creating room for User ${payload.playerName} ID: ${socket.id}:`,
        error
      );
      socket.emit("room:error", { message: (error as Error).message });
    }
  };

  const joinRoomHandler = async (payload: JoinRoomPayload) => {
    try {
      console.log(
        `Join Room requested by User ${payload.playerName} ID: ${socket.id} for Room ${payload.roomId}`
      );

      const updatedRoom = await RoomService.join(
        payload.roomId,
        socket.id,
        payload.playerName
      );

      if (!updatedRoom) {
        throw new Error("Sala não encontrada!");
      }

      socket.join(updatedRoom.id);

      io.to(updatedRoom.id).emit("room_update", updatedRoom);

      console.log(
        `User ${payload.playerName} ID: ${socket.id} joined Room ${payload.roomId}`
      );
    } catch (error) {
      console.error(
        `Error joining room for User ${payload.playerName} ID: ${socket.id}:`,
        error
      );
      socket.emit("room:error", { message: (error as Error).message });
    }
  };

  const leaveRoomHandler = async () => {
    try {
      console.log(`Leave Room requested by User ID: ${socket.id}`);

      const updatedRoom = await RoomService.leave(socket.id);

      if (updatedRoom) {
        io.to(updatedRoom.id).emit("room_update", updatedRoom);
        socket.leave(updatedRoom.id);
      } else {
        console.log("No room to leave for this user.");
      }
      console.log(`User ID: ${socket.id} left their room successfully.`);
    } catch (error) {
      console.error(`Error leaving room for User ID: ${socket.id}:`, error);
      socket.emit("room:error", { message: (error as Error).message });
    }
  };

  const addCustomThemesHandler = async (payload: {
    themes: Record<string, string[]>;
  }) => {
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
  };

  const startGameHandler = async (payload: StartGamePayload) => {
    try {
      console.log(`Start Game requested by User ID: ${socket.id}`);

      if (!payload.theme) {
        throw new Error("Theme must be provided to start the game");
      }

      const roomId = await RoomService.getRoomIdByPlayer(socket.id);

      if (!roomId) {
        throw new Error("Player is not in any room");
      }

      console.log(
        `🎮 Iniciando jogo na sala ${roomId} com tema ${payload.theme}`
      );

      // 2. Roda o sorteio
      const { room, secretWord, impostorId } = await RoomService.startGame(
        roomId,
        payload.theme
      );

      room.players.forEach((player: Player) => {
        const isImpostor = player.id === impostorId;

        const secretPayload = {
          role: isImpostor ? "IMPOSTOR" : "PLAYER",
          word: isImpostor ? "Você é o Impostor!" : secretWord,
          theme: payload.theme,
        };

        io.to(player.id).emit("game_start", secretPayload);
      });

      io.to(roomId).emit("room_update", room);
    } catch (error) {
      console.error(error);
      socket.emit("room:error", { message: (error as Error).message });
    }
  };

  socket.on("create_room", createRoomHandler);
  socket.on("join_room", joinRoomHandler);
  socket.on("leave_room", leaveRoomHandler);
  socket.on("disconnect", leaveRoomHandler);
  socket.on("start_game", startGameHandler);
  socket.on("upload_custom_themes", addCustomThemesHandler);
};
