import { useRef, useState } from "react";
import { socketService } from "../../services/socket";
import toast from "react-hot-toast";
interface ThemeUploaderProps {
  onClose: () => void;
}

const ThemeUploader = ({ onClose }: ThemeUploaderProps) => {
  const [themeName, setThemeName] = useState("");
  const [wordsInput, setWordsInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!themeName.trim()) {
      return toast.error("Por favor, preencha o nome do tema.");
    }

    const words = wordsInput
      .split(/[\n,]+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    if (words.length < 5) {
      return toast.error(
        `Mínimo de 5 palavras. Você colocou apenas ${words.length}.`,
      );
    }

    const payload = {
      themes: {
        [themeName.toUpperCase()]: words,
      },
    };

    socketService.socket?.emit("upload_custom_themes", payload);

    toast.success("Tema enviado com sucesso!");
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        setWordsInput(text);
        toast.success("Arquivo carregado!");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={{ color: "#333", marginTop: 0 }}>Criar Novo Tema</h2>

        {/* Nome do Tema */}
        <div style={styles.field}>
          <label style={styles.label}>Nome do Tema:</label>
          <input
            type="text"
            placeholder="Ex: Jogadores de Futebol"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            style={styles.input}
            autoFocus
          />
        </div>

        {/* Área de Texto */}
        <div style={styles.field}>
          <label style={styles.label}>
            Palavras (separadas por vírgula ou Enter):
          </label>
          <textarea
            rows={6}
            placeholder="Pelé&#10;Maradona&#10;Ronaldo&#10;Messi&#10;Neymar"
            value={wordsInput}
            onChange={(e) => setWordsInput(e.target.value)}
            style={styles.textarea}
          />
          {/* Contador visual para ajudar o usuário */}
          <small
            style={{ color: "#000000", fontSize: "16px", fontWeight: "500" }}
          >
            Palavras identificadas:{" "}
            {
              wordsInput.split(/[\n,]+/).filter((w) => w.trim().length > 0)
                .length
            }
          </small>
        </div>

        {/* Upload de Arquivo */}
        <div style={{ marginBottom: "15px" }}>
          <input
            type="file"
            accept=".txt"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={styles.btnSecondary}
          >
            📂 Carregar de arquivo .txt
          </button>
        </div>

        {/* Botões de Ação */}
        <div style={styles.actions}>
          <button onClick={onClose} style={styles.btnCancel}>
            Cancelar
          </button>
          <button onClick={handleSave} style={styles.btnSave}>
            Salvar Tema
          </button>
        </div>
      </div>
    </div>
  );
};

// Estilos
const styles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100vw", // Garante largura total
    height: "100vh", // Garante altura total
    background: "rgba(0,0,0,0.8)", // Um pouco mais escuro
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999, // Z-index alto para ficar acima de tudo
    backdropFilter: "blur(2px)", // Efeito de desfoque
  },
  modal: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "500px",
    textAlign: "left" as const,
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)", // Sombra para destaque
  },
  field: { marginBottom: "15px" },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#444",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
    color: "#ffffff",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    resize: "vertical" as const,
    color: "#ffffff",
    fontFamily: "inherit",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  },
  btnSecondary: {
    background: "#f3f4f6",
    border: "1px solid #ddd",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#333",
    fontWeight: "500",
  },
  btnCancel: {
    background: "transparent",
    border: "1px solid #ccc",
    color: "#555",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  btnSave: {
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export { ThemeUploader };
