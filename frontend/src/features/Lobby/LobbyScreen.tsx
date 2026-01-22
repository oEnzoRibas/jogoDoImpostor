import { PageContainer } from "../../components/Page/PageContainer";
import { PrimaryButton } from "../../components/Buttons/PrimaryButton";

import { useLobbyLogic } from "./hooks/useLobbyLogic";
import { ThemeManager } from "./components/ThemeManager/ThemeManager";
import { RoomHeader } from "./components/RoomHeader/RoomHeader";
import { PlayerList } from "./components/PlayerList/PlayerList";
import { HostControls } from "./components/HostControls/HostControls";
import Loading from "../../components/Loading/Loading";

const LobbyScreen = () => {
  const logic = useLobbyLogic();

  if (logic.isLoading) {
    return <Loading />;
  }
  return (
    <PageContainer>
      {/* Management Modal */}
      {logic.showThemeModal && (
        <ThemeManager
          onClose={() => logic.setShowThemeModal(false)}
          onSelectTheme={(themeName) => logic.setSelectedTheme(themeName)}
        />
      )}

      {/* Header */}
      <RoomHeader roomId={logic.room!.id} />

      {/* Player List */}
      <PlayerList players={logic.room!.players} myId={logic.me!.id} />

      {/* Control Panel (Updated) */}
      <HostControls
        isHost={logic.me!.isHost}
        selectedTheme={logic.selectedTheme}
        maxRounds={logic.preferredMaxRounds}
        onRoundsChange={logic.setPreferredMaxRounds}
        onOpenManager={() => logic.setShowThemeModal(true)}
        onStart={logic.handleStartGame}
        canStart={logic.canStart}
      />

      {/* Quit Button */}
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
          QUIT ROOM
        </PrimaryButton>
      </div>
    </PageContainer>
  );
};

export default LobbyScreen;
