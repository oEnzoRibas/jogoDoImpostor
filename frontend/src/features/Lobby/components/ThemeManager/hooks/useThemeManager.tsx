import { useState } from "react";
import toast from "react-hot-toast";
import { getAvailableThemes } from "@jdi/shared/src/themes";
import { useMyThemes, type SavedTheme } from "../../../../../hooks/useMyThemes";
import { socketService } from "../../../../../services/socket";
import type { Theme } from "@jdi/shared";

type ViewState = "LIST" | "EDITOR";

export const useThemeManager = (
  onClose: () => void,
  onSelectTheme: (themeName: string) => void,
) => {
  const { savedThemes, saveThemeToLibrary, removeThemeFromLibrary } =
    useMyThemes();
  const standardThemes: Theme[] = getAvailableThemes();

  // Estado da View
  const [view, setView] = useState<ViewState>("LIST");
  const [editingTheme, setEditingTheme] = useState<SavedTheme | null>(null);

  // Ações
  const handleSelect = (themeName: string) => {
    const customTheme = savedThemes.find((t) => t.name === themeName);

    if (customTheme) {
      socketService.socket?.emit("upload_custom_themes", {
        themes: { [customTheme.name]: customTheme.words },
      });
    }

    onSelectTheme(themeName);
    onClose();
    toast.success(`Theme "${themeName}" selected!`);
  };

  const handleCreateNew = () => {
    setEditingTheme(null); // Limpa para criar novo
    setView("EDITOR");
  };

  const handleEdit = (theme: SavedTheme) => {
    setEditingTheme(theme);
    setView("EDITOR");
  };

  const handleDelete = (themeName: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita selecionar o card ao clicar em deletar
    if (confirm(`Are you sure you want to delete "${themeName}"?`)) {
      removeThemeFromLibrary(themeName);
      toast.success("Theme removed.");
    }
  };

  const handleSave = (name: string, words: string[]) => {
    saveThemeToLibrary(name, words);
    setView("LIST"); // Volta para a lista
    toast.success("Theme saved to library!");
  };

  return {
    view,
    setView,
    standardThemes,
    savedThemes,
    editingTheme,
    handleSelect,
    handleCreateNew,
    handleEdit,
    handleDelete,
    handleSave,
  };
};
