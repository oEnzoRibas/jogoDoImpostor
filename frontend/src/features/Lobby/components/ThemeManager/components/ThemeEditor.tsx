import { useState, useEffect } from "react";
import { PrimaryButton } from "../../../../../components/Buttons/PrimaryButton";
import { Input } from "../../../../../components/Input/Input";
import { type SavedTheme } from "../../../../../hooks/useMyThemes";
import { theme } from "../../../../../styles/theme";
import toast from "react-hot-toast";

interface Props {
  initialData: SavedTheme | null;
  onSave: (name: string, words: string[]) => void;
  onCancel: () => void;
}

export const ThemeEditor = ({ initialData, onSave, onCancel }: Props) => {
  const [name, setName] = useState("");
  const [words, setWords] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setWords(initialData.words.join("\n"));
    }
  }, [initialData]);

  const handleSave = () => {
    if (!name.trim()) return toast.error("Nome obrigatório");
    const wordList = words
      .split(/[\n,]+/)
      .map((w) => w.trim())
      .filter((w) => w);
    if (wordList.length < 5) return toast.error("Mínimo de 5 palavras");

    onSave(name.toUpperCase(), wordList);
  };

  return (
    <div
      style={{
        padding: theme.spacing.l,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: theme.spacing.m,
        }}
      >
        <button
          onClick={onCancel}
          style={{
            background: "none",
            border: "none",
            color: theme.colors.text.secondary,
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          ← Go Back
        </button>
        <h3 style={{ margin: 0, color: theme.colors.primary }}>
          {initialData ? "EDITAR TEMA" : "NOVO TEMA"}
        </h3>
      </div>

      <Input
        placeholder="NOME DO TEMA"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: theme.spacing.m, textTransform: "uppercase" }}
      />

      <textarea
        value={words}
        onChange={(e) => setWords(e.target.value)}
        placeholder="Digite palavras separadas por ENTER..."
        style={{
          flex: 1,
          background: "#151515",
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.borderRadius.m,
          color: "white",
          padding: theme.spacing.m,
          resize: "none",
          outline: "none",
        }}
      />

      <div style={{ marginTop: theme.spacing.m }}>
        <PrimaryButton onClick={handleSave} fullWidth>
          💾 SAVE THEME
        </PrimaryButton>
      </div>
    </div>
  );
};
