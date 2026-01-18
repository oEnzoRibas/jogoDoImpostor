import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { socketService } from "../../../services/socket";
import { useMyThemes, type SavedTheme } from "../../../hooks/useMyThemes";

// Imports do Design System
import { PrimaryButton } from "../../../components/Buttons/PrimaryButton";
import { Input } from "../../../components/Input/Input";
import { theme } from "../../../styles/theme";

interface ThemeUploaderProps {
  onClose: () => void;
}

export const ThemeUploader = ({ onClose }: ThemeUploaderProps) => {
  // Hooks
  const { savedThemes, saveThemeToLibrary, removeThemeFromLibrary } =
    useMyThemes();

  // State
  const [themeName, setThemeName] = useState("");
  const [wordsInput, setWordsInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- AÇÕES (Lógica mantida idêntica) ---

  const validateForm = () => {
    if (!themeName.trim()) {
      toast.error("Preencha o nome do tema.");
      return null;
    }
    const words = wordsInput
      .split(/[\n,]+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    if (words.length < 5) {
      toast.error(`Mínimo de 5 palavras. (Atual: ${words.length})`);
      return null;
    }
    return { name: themeName.toUpperCase(), words };
  };

  const handleSaveToLibrary = () => {
    const data = validateForm();
    if (data) saveThemeToLibrary(data.name, data.words);
  };

  const handleUploadToRoom = (
    nameOverride?: string,
    wordsOverride?: string[],
  ) => {
    let name = nameOverride;
    let words = wordsOverride;

    if (!name || !words) {
      const data = validateForm();
      if (!data) return;
      name = data.name;
      words = data.words;
    }

    const payload = { themes: { [name!]: words! } };
    socketService.socket?.emit("upload_custom_themes", payload);
    toast.success(`Tema "${name}" enviado para a sala!`);
    onClose();
  };

  const handleEdit = (themeData: SavedTheme) => {
    setThemeName(themeData.name);
    setWordsInput(themeData.words.join("\n"));
    toast("Carregado para edição.", { icon: "✏️" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string")
        setWordsInput(ev.target.result);
    };
    reader.readAsText(file);
  };

  return (
    // OVERLAY (Fundo Escuro Transparente)
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.85)", // Fundo bem escuro para foco
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(5px)", // Efeito blur moderno
      }}
    >
      {/* MODAL CONTAINER */}
      <div
        style={{
          background: theme.colors.surface, // #1e1e1e
          width: "95%",
          maxWidth: "900px",
          borderRadius: theme.borderRadius.l,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
          color: theme.colors.text.primary,
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: theme.spacing.l,
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
              fontSize: theme.fontSize.l,
              color: theme.colors.primary,
            }}
          >
            GERENCIAR TEMAS 📚
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: theme.colors.text.secondary,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = theme.colors.secondary)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = theme.colors.text.secondary)
            }
          >
            ✕
          </button>
        </div>

        {/* CONTENT (Grid Responsivo) */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flex: 1,
            overflow: "hidden",
          }}
        >
          {/* COLUNA ESQUERDA: EDITOR */}
          <div
            style={{
              flex: 1,
              padding: theme.spacing.l,
              display: "flex",
              flexDirection: "column",
              gap: theme.spacing.m,
              overflowY: "auto",
            }}
          >
            <h4
              style={{
                margin: 0,
                color: theme.colors.text.secondary,
                textTransform: "uppercase",
                fontSize: theme.fontSize.s,
              }}
            >
              Criar ou Editar
            </h4>

            <Input
              placeholder="NOME DO TEMA (EX: Times de Futebol)"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              style={{ textTransform: "uppercase" }}
            />

            {/* TextArea Customizado para parecer com o Input */}
            <textarea
              rows={10}
              placeholder="Digite as palavras separadas por ENTER..."
              value={wordsInput}
              onChange={(e) => setWordsInput(e.target.value)}
              style={{
                width: "100%",
                padding: theme.spacing.m,
                fontSize: theme.fontSize.m,
                borderRadius: theme.borderRadius.m,
                border: `1px solid ${theme.colors.border}`,
                backgroundColor: "#151515", // Mesmo fundo do Input
                color: theme.colors.text.primary,
                outline: "none",
                resize: "none",
                fontFamily: "inherit",
                flex: 1,
              }}
            />

            <div style={{ display: "flex", gap: theme.spacing.s }}>
              <PrimaryButton
                onClick={handleSaveToLibrary}
                variant="secondary"
                fullWidth
              >
                💾 Salvar
              </PrimaryButton>
              <PrimaryButton
                onClick={() => handleUploadToRoom()}
                variant="primary"
                fullWidth
              >
                🚀 Enviar
              </PrimaryButton>
            </div>

            {/* Link de Upload */}
            <div style={{ textAlign: "center", fontSize: theme.fontSize.s }}>
              <span
                onClick={() => fileInputRef.current?.click()}
                style={{
                  cursor: "pointer",
                  color: theme.colors.text.secondary,
                  textDecoration: "underline",
                }}
              >
                Ou importe um arquivo .txt
              </span>
              <input
                type="file"
                accept=".txt"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* COLUNA DIREITA: BIBLIOTECA */}
          <div
            style={{
              flex: 1,
              background: "rgba(0,0,0,0.2)", // Levemente mais escuro
              borderLeft: `1px solid ${theme.colors.border}`,
              padding: theme.spacing.l,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <h4
              style={{
                margin: `0 0 ${theme.spacing.m} 0`,
                color: theme.colors.text.secondary,
                textTransform: "uppercase",
                fontSize: theme.fontSize.s,
              }}
            >
              Minha Biblioteca ({savedThemes.length})
            </h4>

            {savedThemes.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: theme.colors.text.disabled,
                  marginTop: theme.spacing.xl,
                }}
              >
                <p>Nenhum tema salvo.</p>
                <p style={{ fontSize: "40px" }}>📂</p>
              </div>
            ) : (
              <div
                style={{
                  overflowY: "auto",
                  flex: 1,
                  paddingRight: theme.spacing.s,
                }}
              >
                {savedThemes.map((themeData) => (
                  <div
                    key={themeData.name}
                    style={{
                      background: theme.colors.background,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: theme.borderRadius.m,
                      padding: theme.spacing.m,
                      marginBottom: theme.spacing.s,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "transform 0.1s",
                    }}
                  >
                    <div style={{ overflow: "hidden" }}>
                      <strong
                        style={{
                          display: "block",
                          color: theme.colors.text.primary,
                        }}
                      >
                        {themeData.name}
                      </strong>
                      <span
                        style={{
                          fontSize: theme.fontSize.s,
                          color: theme.colors.text.secondary,
                        }}
                      >
                        {themeData.words?.length || 0} palavras
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      {/* Botões de Ação Mini */}
                      <button
                        title="Enviar para Sala"
                        onClick={() =>
                          handleUploadToRoom(themeData.name, themeData.words)
                        }
                        style={miniButtonStyle(theme.colors.primary)}
                      >
                        🚀
                      </button>
                      <button
                        title="Editar"
                        onClick={() => handleEdit(themeData)}
                        style={miniButtonStyle(theme.colors.accent)}
                      >
                        ✏️
                      </button>
                      <button
                        title="Excluir"
                        onClick={() => removeThemeFromLibrary(themeData.name)}
                        style={miniButtonStyle(theme.colors.secondary)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper para os botões pequenos da lista (evita repetição inline)
const miniButtonStyle = (color: string): React.CSSProperties => ({
  background: "transparent",
  border: `1px solid ${color}`,
  color: color,
  borderRadius: "4px",
  width: "30px",
  height: "30px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "14px",
  transition: "all 0.2s",
});
