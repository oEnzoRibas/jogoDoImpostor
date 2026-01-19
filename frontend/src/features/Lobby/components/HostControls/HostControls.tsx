import { PrimaryButton } from "../../../../components/Buttons/PrimaryButton";
import { Card } from "../../../../components/Card/Card";
import { Input } from "../../../../components/Input/Input";
import { theme } from "../../../../styles/theme";

interface Props {
  isHost: boolean;
  selectedTheme: string;
  maxRounds: number;
  onRoundsChange: (n: number) => void;
  onOpenManager: () => void; // Nova prop
  onStart: () => void;
  canStart: boolean;
}

export const HostControls = ({
  isHost,
  selectedTheme,
  maxRounds,
  onRoundsChange,
  onOpenManager,
  onStart,
  canStart,
}: Props) => {
  if (!isHost) {
    return (
      <div
        style={{ textAlign: "center", padding: theme.spacing.l, opacity: 0.7 }}
      >
        <p>Aguardando o anfitrião iniciar a partida...</p>
      </div>
    );
  }

  return (
    <Card style={{ border: `1px solid ${theme.colors.primary}` }}>
      <h3
        style={{ color: theme.colors.primary, marginBottom: theme.spacing.m }}
      >
        CONFIGURAÇÕES
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing.m,
        }}
      >
        {/* SELETOR DE TEMA (Novo Design) */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              color: theme.colors.text.secondary,
              fontSize: "12px",
            }}
          >
            TEMA SELECIONADO
          </label>
          <div
            onClick={onOpenManager}
            style={{
              background: "#151515",
              border: `1px solid ${theme.colors.border}`,
              padding: theme.spacing.m,
              borderRadius: theme.borderRadius.m,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = theme.colors.accent)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = theme.colors.border)
            }
          >
            <span
              style={{
                color: theme.colors.text.primary,
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              {selectedTheme}
            </span>
            <span
              style={{
                fontSize: "12px",
                color: theme.colors.accent,
                textTransform: "uppercase",
              }}
            >
              Alterar ➜
            </span>
          </div>
        </div>

        {/* INPUT DE RODADAS */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              color: theme.colors.text.secondary,
              fontSize: "12px",
            }}
          >
            RODADAS
          </label>
          <Input
            type="number"
            min={1}
            max={10}
            value={maxRounds}
            onChange={(e) => onRoundsChange(Number(e.target.value))}
          />
        </div>

        <PrimaryButton onClick={onStart} disabled={!canStart} fullWidth>
          {!canStart ? "AGUARDANDO JOGADORES..." : "INICIAR JOGO 🚀"}
        </PrimaryButton>
      </div>
    </Card>
  );
};
