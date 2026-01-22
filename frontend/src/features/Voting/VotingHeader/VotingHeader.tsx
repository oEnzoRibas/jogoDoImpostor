import { theme } from "../../../styles/theme";

interface Props {
  iHaveVoted?: boolean | undefined;
}

const VotingHeader = ({ iHaveVoted }: Props) => {
  return (
    <div style={{ textAlign: "center", marginBottom: theme.spacing.xl }}>
      <h1
        style={{
          color: theme.colors.secondary,
          fontSize: "2.5rem",
          marginBottom: theme.spacing.s,
          textTransform: "uppercase",
          letterSpacing: "2px",
          animation: "pulseRed 2s infinite",
        }}
      >
        WHO IS THE IMPOSTOR? 🕵️
      </h1>
      <style>{`
          @keyframes pulseRed {
            0% { text-shadow: 0 0 0 rgba(239, 68, 68, 0); }
            50% { text-shadow: 0 0 20px rgba(239, 68, 68, 0.5); }
            100% { text-shadow: 0 0 0 rgba(239, 68, 68, 0); }
          }
        `}</style>

      <p
        style={{
          color: theme.colors.text.secondary,
          fontSize: theme.fontSize.m,
        }}
      >
        {!iHaveVoted
          ? "Vote recorded. Waiting for other players..."
          : "Click on the suspect to confirm your vote."}
      </p>
    </div>
  );
};

export default VotingHeader;
