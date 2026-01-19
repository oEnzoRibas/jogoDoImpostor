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
      // Dica: Use o toast aqui no futuro em vez de alert
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
    <PageContainer>
      {/* Título e Logo */}
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
          Identifique o impostor.
        </p>
      </div>

      {/* Cartão Central de Ações */}
      <Card style={{ maxWidth: "400px", width: "100%", margin: "0 auto" }}>
        {/* Input de Nome (Global) */}
        <div style={{ marginBottom: theme.spacing.l }}>
          <label
            style={{
              display: "block",
              marginBottom: theme.spacing.xs,
              fontSize: theme.fontSize.s,
              color: theme.colors.text.secondary,
            }}
          >
            SEU NICKNAME
          </label>
          <Input
            type="text"
            placeholder="Ex: Detetive Silva"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        {/* Botão de Criar */}
        <PrimaryButton
          variant="primary"
          fullWidth
          onClick={handleCreateRoom}
          style={{ marginBottom: theme.spacing.l }}
        >
          CRIAR NOVA SALA 🎮
        </PrimaryButton>

        {/* Divisor Visual */}
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
            OU ENTRE EM UMA
          </span>
          <div
            style={{ flex: 1, height: "1px", background: theme.colors.border }}
          ></div>
        </div>

        {/* Área de Join */}
        <div style={{ display: "flex", gap: theme.spacing.s }}>
          <Input
            type="text"
            placeholder="CÓDIGO (ex: XJ92)"
            value={roomIdInput}
            onChange={(e) => setRoomIdInput(e.target.value)}
            maxLength={4}
            style={{
              marginBottom: 0,
              textTransform: "uppercase",
              textAlign: "center",
              letterSpacing: "2px",
              fontWeight: "bold",
              width: "140px", // Fixo para caber o código
            }}
          />
          <PrimaryButton variant="secondary" fullWidth onClick={handleJoinRoom}>
            ENTRAR 🚀
          </PrimaryButton>
        </div>
      </Card>

      {/* Rodapé ou Debug */}
      <p
        style={{
          textAlign: "center",
          marginTop: theme.spacing.xl,
          color: theme.colors.text.disabled,
          fontSize: theme.fontSize.s,
        }}
      >
        Status do Sistema: {gameState}
      </p>
    </PageContainer>
  );
};

export default HomeScreen;
