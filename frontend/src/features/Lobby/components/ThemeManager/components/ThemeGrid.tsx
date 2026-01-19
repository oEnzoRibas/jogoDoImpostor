import type React from "react";
import { theme } from "../../../../../styles/theme";
import { ThemeCard } from "./ThemeCard";
import type { SavedTheme } from "../../../../../hooks/useMyThemes";
import { type Theme } from "@jdi/shared";

interface Props {
  standardThemes: Theme[];
  savedThemes: SavedTheme[];
  onSelect: (name: string) => void;
  onCreate: () => void;
  onEdit: (t: SavedTheme) => void;
  onDelete: (name: string, e: React.MouseEvent) => void;
}

export const ThemeGrid = ({
  standardThemes,
  savedThemes,
  onSelect,
  onCreate,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <div
      style={{ padding: theme.spacing.l, overflowY: "auto", maxHeight: "70vh" }}
    >
      {/* Botão Gigante de Criar Novo */}
      <div
        onClick={onCreate}
        style={{
          border: `2px dashed ${theme.colors.border}`,
          borderRadius: theme.borderRadius.m,
          padding: theme.spacing.m,
          marginBottom: theme.spacing.l,
          textAlign: "center",
          cursor: "pointer",
          color: theme.colors.text.secondary,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = theme.colors.accent;
          e.currentTarget.style.color = theme.colors.accent;
          e.currentTarget.style.background = "rgba(255,255,255,0.02)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = theme.colors.border;
          e.currentTarget.style.color = theme.colors.text.secondary;
          e.currentTarget.style.background = "transparent";
        }}
      >
        <span
          style={{ fontSize: "24px", display: "block", marginBottom: "5px" }}
        >
          +
        </span>
        <strong>CREATE NEW THEME</strong>
      </div>

      {/* My Themes */}
      {savedThemes.length > 0 && (
        <div style={{ marginBottom: theme.spacing.l }}>
          <h3
            style={{
              color: theme.colors.text.secondary,
              fontSize: "12px",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            My Themes 📂
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "10px",
            }}
          >
            {savedThemes.map((t) => (
              <ThemeCard
                key={t.name}
                title={t.name}
                count={t.words.length}
                preview={t.words}
                isCustom
                onClick={() => onSelect(t.name)}
                onEdit={() => onEdit(t)}
                onDelete={(e) => onDelete(t.name, e)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Standard Themes */}
      <div>
        <h3
          style={{
            color: theme.colors.text.secondary,
            fontSize: "12px",
            textTransform: "uppercase",
            marginBottom: "10px",
          }}
        >
          Default Themes 🎨
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 133fr))",
            gap: "15px",
          }}
        >
          {standardThemes.map((themeObj) => (
            <ThemeCard
              key={themeObj.name}
              title={themeObj.name}
              icon={themeObj.icon}
              count={themeObj.words.length}
              onClick={() => onSelect(themeObj.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
