import { Card } from "../../../../components/Card/Card";
import { theme } from "../../../../styles/theme";
import { type Player } from "@jdi/shared";

interface Props {
  players: Player[];
  myId: string;
}

export const PlayerList = ({ players, myId }: Props) => {
  return (
    <Card>
      <h3 style={{ color: theme.colors.text.primary, marginBottom: theme.spacing.m }}>
        JOGADORES ({players.length})
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {players.map((player) => (
          <div
            key={player.id}
            style={{
              background: player.id === myId ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.2)",
              padding: theme.spacing.m,
              borderRadius: theme.borderRadius.m,
              border: player.isHost ? `1px solid ${theme.colors.accent}` : "1px solid transparent",
              display: "flex", justifyContent: "space-between"
            }}
          >
            <span>{player.name} {player.id === myId && "(Você)"}</span>
            {player.isHost && <span style={{ color: theme.colors.accent }}>👑 HOST</span>}
          </div>
        ))}
      </div>
    </Card>
  );
};