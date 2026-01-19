import { theme } from "../../../../styles/theme";

interface Props {
  player: {
    id: string;
    name: string;
    isHost?: boolean;
  };

  me: {
    id: string;
  };

  isPlayerTurn: boolean;
}
const Avatar = ({ player, me, isPlayerTurn }: Props) => {
  return (
    <div>
      <div
        style={{
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          background: theme.colors.surface,
          border: isPlayerTurn
            ? `3px solid ${theme.colors.accent}`
            : player.id === me.id
              ? `3px solid ${theme.colors.primary}`
              : `3px solid transparent`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          fontWeight: "bold",
          boxShadow: isPlayerTurn
            ? `0 0 15px ${theme.colors.accent}60`
            : "none",
          transition: "all 0.3s",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            position: "relative",
          }}
        >
          {player.name.charAt(0).toUpperCase()}

          {player.isHost?.valueOf() && (
            <span
              style={{
                position: "absolute",
                bottom: "-5px",
                right: "-5px",
                background: theme.colors.primary,
                color: "#fff",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold",
                boxShadow: `0 0 5px ${theme.colors.primary}60`,
              }}
              title="Host"
            >
              👑
            </span>
          )}
        </div>
      </div>

      <span
        style={{
          marginTop: "8px",
          fontSize: theme.fontSize.s,
          fontWeight: "bold",
          color: isPlayerTurn ? theme.colors.accent : theme.colors.text.primary,
        }}
      >
        {player.name}
      </span>
    </div>
  );
};

export default Avatar;
