import { getAvailableThemes } from "@jdi/shared/src/themes";
import { useGame } from "../../../context/GameContext";
import toast from "react-hot-toast";
import { useSocketEvent } from "../../../hooks/useSocketEvent";
import { DEFAULT_MAX_ROUNDS } from "@jdi/shared/src/constants";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { useState } from "react";
import type { Theme } from "@jdi/shared";

const INITIAL_THEMES = getAvailableThemes();

export const useLobbyLogic = () => {
  const { room, me, startGame, leaveRoom, gameState } = useGame();

  const [availableThemes, setAvailableThemes] =
    useState<Theme[]>(INITIAL_THEMES);

  const [selectedTheme, setSelectedTheme] = useState<string>(
    INITIAL_THEMES[0].name,
  );

  const [showThemeModal, setShowThemeModal] = useState(false);

  const [preferredMaxRounds, setPreferredMaxRounds] = useLocalStorage(
    "jdi_preferred_max_rounds",
    DEFAULT_MAX_ROUNDS,
  );

  useSocketEvent<Theme[]>("themes_updated", (newThemes) => {
    if (!Array.isArray(newThemes)) return;

    setAvailableThemes((currentThemes) => {
      const themeMap = new Map();

      [...INITIAL_THEMES, ...currentThemes].forEach((t) =>
        themeMap.set(t.name, t),
      );

      newThemes.forEach((t) => themeMap.set(t.name, t));

      return Array.from(themeMap.values());
    });

    if (newThemes.length > 0) {
      setSelectedTheme(newThemes[newThemes.length - 1].name);
    }
  });

  const handleStartGame = () => {
    if (!room) return;
    if (room.players.length < 2) {
      toast.error("Mínimo de 2 jogadores!");
      return;
    }
    startGame(selectedTheme, preferredMaxRounds);
  };

  return {
    room,
    me,
    gameState,
    availableThemes,
    selectedTheme,
    setSelectedTheme,
    preferredMaxRounds,
    setPreferredMaxRounds,
    showThemeModal,
    setShowThemeModal,
    handleStartGame,
    leaveRoom,
    isLoading: !room || !me,
    canStart: room ? room.players.length >= 2 : false,
  };
};
