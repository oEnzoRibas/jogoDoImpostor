import { theme } from "../../../styles/theme";

interface Props {
  impostorWon: boolean;
  iWon: boolean;
  resultColor: string;
}

const WinnerText = ({ impostorWon, iWon, resultColor }: Props) => {
  return (
    <div style={{ textAlign: "center", marginBottom: theme.spacing.l }}>
      <div
        style={{
          fontSize: "4rem",
          marginBottom: "10px",
          animation: "bounce 1s",
        }}
      >
        {impostorWon ? "😈" : "🕵️‍♂️"}
      </div>
      <style>{`@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }`}</style>

      <h1
        style={{
          fontSize: "2.5rem",
          margin: 0,
          color: resultColor,
          textTransform: "uppercase",
          textShadow: `0 0 20px ${resultColor}60`,
        }}
      >
        {impostorWon ? "IMPOSTOR VICTORY" : "THE INNOCENTS WON"}
      </h1>

      <h2
        style={{
          marginTop: theme.spacing.s,
          color: iWon ? theme.colors.text.primary : theme.colors.text.secondary,
          fontSize: theme.fontSize.l,
        }}
      >
        {iWon ? "🏆 YOU WON" : "☠️ YOU LOST..."}
      </h2>
    </div>
  );
};

export default WinnerText;
