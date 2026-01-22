import { useLocalStorage } from "./useLocalStorage";
import toast from "react-hot-toast";

export interface SavedTheme {
  name: string;
  words: string[];
}

export const useMyThemes = () => {
  const [savedThemes, setSavedThemes] = useLocalStorage<SavedTheme[]>(
    "my_themes",
    [],
  );

  const saveThemeToLibrary = (name: string, words: string[]) => {
    const normalizedName = name.trim().toUpperCase();

    const newTheme: SavedTheme = { name: normalizedName, words };

    setSavedThemes((prev) => {
      const filtered = prev.filter((t) => t.name !== normalizedName);
      return [...filtered, newTheme];
    });

    toast.success("Theme saved to your library!");
  };

  const removeThemeFromLibrary = (themeName: string) => {
    setSavedThemes((prev) => prev.filter((t) => t.name !== themeName));
    toast.success("Theme removed from library.");
  };

  return { savedThemes, saveThemeToLibrary, removeThemeFromLibrary };
};
