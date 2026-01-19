import { theme } from "../../../../styles/theme";
import { useThemeManager } from "./hooks/useThemeManager";
import { ThemeGrid } from "./components/ThemeGrid";
import { ThemeEditor } from "./components/ThemeEditor";
import { Modal } from "../../../../components/Modal/Modal";

interface Props {
  onClose: () => void;
  onSelectTheme: (themeName: string) => void;
}

export const ThemeManager = ({ onClose, onSelectTheme }: Props) => {
  const logic = useThemeManager(onClose, onSelectTheme);

  return (
    <Modal onClose={onClose} style={{ maxWidth: "800px", height: "80vh" }}>
      {/* Header */}
      <div
        style={{
          padding: theme.spacing.m,
          borderBottom: `1px solid ${theme.colors.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "18px",
            color: theme.colors.text.primary,
          }}
        >
          {logic.view === "LIST" ? "SELECIONAR TEMA 🎨" : "EDITOR DE TEMA ✏️"}
        </h2>

        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "20px",
          }}
        >
          ✕
        </button>
      </div>

      {/* Content Switcher */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {logic.view === "LIST" ? (
          <ThemeGrid
            standardThemes={logic.standardThemes}
            savedThemes={logic.savedThemes}
            onSelect={logic.handleSelect}
            onCreate={logic.handleCreateNew}
            onEdit={logic.handleEdit}
            onDelete={logic.handleDelete}
          />
        ) : (
          <ThemeEditor
            initialData={logic.editingTheme}
            onSave={logic.handleSave}
            onCancel={() => logic.setView("LIST")}
          />
        )}
      </div>
    </Modal>
  );
};
