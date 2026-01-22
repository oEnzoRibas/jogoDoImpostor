import type { Player, Room } from "@jdi/shared";
import { theme } from "../../../styles/theme";

interface Props {
  room: Room;
  selectedPlayerId: string | null;
  setSelectedPlayerId: (id: string | null) => void;
  me: Player;
  iHaveVoted: boolean;
}

const VotingPlayerList = ({
  room,
  selectedPlayerId,
  setSelectedPlayerId,
  me,
  iHaveVoted,
}: Props) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: theme.spacing.xl,
        marginBottom: theme.spacing.xl,
      }}
    >
      {room.players.map((player) => {
        const isSelected = selectedPlayerId === player.id;
        const isMe = player.id === me.id;

        const opacity = iHaveVoted ? (isSelected ? 1 : 0.3) : 1;

        return (
          <div
            key={player.id}
            onClick={() => {
              if (!iHaveVoted && !isMe) setSelectedPlayerId(player.id);
            }}
            style={{
              cursor: iHaveVoted || isMe ? "default" : "pointer",
              opacity: opacity,
              transform: isSelected ? "scale(1.15)" : "scale(1)",
              transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Avatar Container */}
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: isSelected
                  ? theme.colors.secondary
                  : theme.colors.surface,
                border: isSelected ? `4px solid #fff` : `4px solid transparent`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "40px",
                position: "relative",
                boxShadow: isSelected
                  ? `0 0 20px ${theme.colors.secondary}`
                  : "0 4px 10px rgba(0,0,0,0.3)",
              }}
            >
              {player.name.charAt(0).toUpperCase()}

              {/* Already Voted Badge (Green Check) */}
              {player.hasVoted && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: theme.colors.primary,
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    border: `3px solid ${theme.colors.background}`,
                    boxShadow: "0 2px 5px rgba(0,0,0,0.5)",
                  }}
                  title="This player has already voted"
                >
                  ✅
                </div>
              )}
            </div>

            <span
              style={{
                marginTop: theme.spacing.s,
                fontWeight: "bold",
                fontSize: theme.fontSize.m,
                color: isSelected
                  ? theme.colors.secondary
                  : theme.colors.text.primary,
                textShadow: isSelected
                  ? "0 0 10px rgba(239,68,68,0.5)"
                  : "none",
              }}
            >
              {player.name} {isMe && "(Você)"}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default VotingPlayerList;
