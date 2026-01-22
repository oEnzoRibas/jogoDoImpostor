import { Card } from "../../../components/Card/Card";
import { theme } from "../../../styles/theme";

interface Props {
  text: string;
  blockText: string;
}

const MatchDetailsCard = ({ text, blockText }: Props) => {
  return (
    <Card
      style={{
        textAlign: "center",
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      <p
        style={{
          margin: 0,
          color: theme.colors.text.secondary,
          fontSize: theme.fontSize.s,
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        {text}
      </p>
      <div
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          color: theme.colors.text.primary,
          marginTop: theme.spacing.s,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <span
          style={{
            background: theme.colors.secondary,
            color: "#fff",
            padding: "5px 15px",
            borderRadius: "8px",
            fontSize: "1.5rem",
          }}
        >
          {blockText}
        </span>
      </div>
    </Card>
  );
};
export default MatchDetailsCard;
