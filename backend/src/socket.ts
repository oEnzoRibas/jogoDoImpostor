// src/socket.ts
import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { RoomController } from "./modules/room/controllers/room.controller.js";
import { GameController } from "./modules/game/controllers/game.controller.js";

export const setupSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`🔌 Connected: ${socket.id}`);

    // Room events
    socket.on("create_room", (payload) =>
      RoomController.createRoom(io, socket, payload),
    );
    socket.on("join_room", (payload) =>
      RoomController.joinRoom(io, socket, payload),
    );
    socket.on("leave_room", (payload) => RoomController.leaveRoom(io, socket));

    socket.on("upload_custom_themes", (payload) =>
      RoomController.addCustomThemes(io, socket, payload),
    );

    socket.on("reset_room", (payload) => RoomController.resetRoom(io, socket));

    socket.on("disconnect", () => RoomController.leaveRoom(io, socket));

    // Game events
    socket.on("start_game", (payload) =>
      GameController.startGame(io, socket, payload),
    );
    socket.on("submit_word", (payload) =>
      GameController.submitWord(io, socket, payload),
    );
    socket.on("submit_vote", (payload) =>
      GameController.submitVote(io, socket, payload),
    );

    socket.on("start_voting", (payload) =>
      GameController.startVoting(io, socket, payload),
    );
  });

  return io;
};
