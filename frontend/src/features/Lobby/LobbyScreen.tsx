import { useState } from "react";
import { useGame } from "../../context/GameContext"; // Ajuste o import conforme sua pasta

const LobbyScreen = () => {
  const { createRoom, joinRoom, gameState } = useGame();

  const [nickname, setNickname] = useState("");
  const [roomIdInput, setRoomIdInput] = useState("");

  const handleCreateRoom = () => {
    if (nickname.trim() !== "") {
      createRoom(nickname);
    } else {
      alert("Por favor, digite um nickname!");
    }
  };

  const handleJoinRoom = () => {
    if (nickname.trim() === "") {
      alert("Por favor, digite um nickname!");
      return;
    }
    if (roomIdInput.trim() === "") {
      alert("Por favor, digite o ID da sala!");
      return;
    }
    joinRoom(roomIdInput.toUpperCase(), nickname);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", color: "white" }}>
      <h1>Bem-vindo ao Impostor Game 🕵️</h1>
      <p>Current Game State: {gameState}</p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "300px",
          margin: "0 auto",
        }}
      >
        <input
          type="text"
          placeholder="Seu Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={{ padding: "10px", fontSize: "16px" }}
        />

        <button
          onClick={handleCreateRoom}
          style={{ padding: "10px", cursor: "pointer", fontWeight: "bold" }}
        >
          Criar Nova Sala
        </button>

        <hr style={{ width: "100%", margin: "20px 0", borderColor: "#444" }} />

        <input
          type="text"
          placeholder="ID da Sala (ex: XJ92)"
          value={roomIdInput}
          onChange={(e) => setRoomIdInput(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            textTransform: "uppercase",
          }}
        />

        <button
          onClick={handleJoinRoom}
          style={{ padding: "10px", cursor: "pointer", fontWeight: "bold" }}
        >
          Entrar na Sala
        </button>
      </div>
    </div>
  );
};

export default LobbyScreen;