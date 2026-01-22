import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";

// Imports do Design System
import { PageContainer } from "../../components/Page/PageContainer";
import { Card } from "../../components/Card/Card";
import { PrimaryButton } from "../../components/Buttons/PrimaryButton";
import { Input } from "../../components/Input/Input";
import { theme } from "../../styles/theme";

const HomeScreen = () => {
  const { createRoom, joinRoom, gameState } = useGame();

  const [nickname, setNickname] = useLocalStorage("jdi_player_name", "");
  const [roomIdInput, setRoomIdInput] = useState("");

  const handleCreateRoom = () => {
    if (nickname.trim() !== "") {
      createRoom(nickname);
    } else {
      alert("Please enter a nickname!");
    }
  };

  const handleJoinRoom = () => {
    if (nickname.trim() === "") {
      alert("Please enter a nickname!");
      return;
    }
    if (roomIdInput.trim() === "") {
      alert("Please enter the room ID!");
      return;
    }
    joinRoom(roomIdInput.toUpperCase(), nickname);
  };

  return (
    <PageContainer>
      {/* Title and Logo */}
      <div
        style={{
          textAlign: "center",
          marginBottom: theme.spacing.xl,
          marginTop: theme.spacing.l,
        }}
      >
        <h1
          style={{
            color: theme.colors.primary,
            fontSize: "3rem",
            marginBottom: theme.spacing.s,
          }}
        >
          IMPOSTOR{" "}
          <span style={{ color: theme.colors.text.primary }}>GAME</span> 🕵️
        </h1>
        <p style={{ color: theme.colors.text.secondary }}>
          Identify the impostor among your friends!
        </p>
      </div>

      {/* Central Action Card */}
      <Card style={{ maxWidth: "400px", width: "100%", margin: "0 auto" }}>
        {/* Global Name Input */}
        <div style={{ marginBottom: theme.spacing.l }}>
          <label
            style={{
              display: "block",
              marginBottom: theme.spacing.xs,
              fontSize: theme.fontSize.s,
              color: theme.colors.text.secondary,
            }}
          >
            YOUR NICKNAME
          </label>
          <Input
            type="text"
            placeholder="Ex: Detective Silva"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        {/* Create Button */}
        <PrimaryButton
          variant="primary"
          fullWidth
          onClick={handleCreateRoom}
          style={{ marginBottom: theme.spacing.l }}
        >
          CREATE NEW ROOM 🎮
        </PrimaryButton>

        {/* Visual Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: `${theme.spacing.l} 0`,
            color: theme.colors.text.disabled,
          }}
        >
          <div
            style={{ flex: 1, height: "1px", background: theme.colors.border }}
          ></div>
          <span style={{ padding: "0 10px", fontSize: theme.fontSize.s }}>
            JOIN ROOM
          </span>
          <div
            style={{ flex: 1, height: "1px", background: theme.colors.border }}
          ></div>
        </div>

        {/* Join Area */}
        <div style={{ display: "flex", gap: theme.spacing.s }}>
          <Input
            type="text"
            placeholder="CODE (e.g.,XJ92)"
            value={roomIdInput}
            onChange={(e) => setRoomIdInput(e.target.value)}
            maxLength={4}
            style={{
              marginBottom: 0,
              textTransform: "uppercase",
              textAlign: "center",
              letterSpacing: "2px",
              fontWeight: "bold",
              width: "200px",
            }}
          />
          <PrimaryButton variant="secondary" fullWidth onClick={handleJoinRoom}>
            JOIN 🚀
          </PrimaryButton>
        </div>
      </Card>

      {/* Footer or Debug */}
      <p
        style={{
          textAlign: "center",
          marginTop: theme.spacing.xl,
          color: theme.colors.text.disabled,
          fontSize: theme.fontSize.s,
        }}
      >
        <br />
        System Status: {gameState}
      </p>

      {/* Copyright */}
      <p
        style={{
          textAlign: "center",
          marginTop: theme.spacing.l,
          color: theme.colors.text.disabled,
          fontSize: theme.fontSize.m,
        }}
      >
        © 2026 Impostors Game. All rights reserved. Made with ❤️ by{" "}
        <a href="https://github.com/oenzoribas" color="red">
          oEnzoRibas
        </a>
        .
      </p>
    </PageContainer>
  );
};

export default HomeScreen;
