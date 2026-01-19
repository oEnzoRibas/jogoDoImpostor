import { PageContainer } from "../../components/Page/PageContainer";
import { PrimaryButton } from "../../components/Buttons/PrimaryButton";

import { useLobbyLogic } from "./hooks/useLobbyLogic";
import { ThemeManager } from "./components/ThemeManager/ThemeManager";
import { RoomHeader } from "./components/RoomHeader/RoomHeader";
import { PlayerList } from "./components/PlayerList/PlayerList";
import { HostControls } from "./components/HostControls/HostControls";
import Loading from "../../components/Page/Loading";

const LobbyScreen = () => {
  const logic = useLobbyLogic();

  if (logic.isLoading) {
    return <Loading />;
  }
  return (
    <PageContainer>
      {/* O Novo Modal de Gerenciamento */}
      {logic.showThemeModal && (
        <ThemeManager
          onClose={() => logic.setShowThemeModal(false)}
          onSelectTheme={(themeName) => logic.setSelectedTheme(themeName)}
        />
      )}

      {/* Cabeçalho */}
      <RoomHeader roomId={logic.room!.id} />

      {/* Lista de Jogadores */}
      <PlayerList players={logic.room!.players} myId={logic.me!.id} />

      {/* Painel de Controle (Atualizado) */}
      <HostControls
        isHost={logic.me!.isHost}
        selectedTheme={logic.selectedTheme}
        maxRounds={logic.preferredMaxRounds}
        onRoundsChange={logic.setPreferredMaxRounds}
        onOpenManager={() => logic.setShowThemeModal(true)} // Abre o Manager
        onStart={logic.handleStartGame}
        canStart={logic.canStart}
      />

      {/* Botão Sair */}
      <div
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        <PrimaryButton
          variant="secondary"
          onClick={logic.leaveRoom}
          style={{
            borderColor: "#ef4444",
            color: "#ef4444",
            background: "transparent",
          }}
        >
          SAIR DA SALA
        </PrimaryButton>
      </div>
    </PageContainer>
  );
};

export default LobbyScreen;
