import { PrimaryButton } from "../../../components/Buttons/PrimaryButton";
import { theme } from "../../../styles/theme";

interface Props {
  handleConfirmVote: () => void;
  selectedPlayerId: string | null;
}

const ConfirmVoteButton = ({ handleConfirmVote, selectedPlayerId }: Props) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <PrimaryButton
        onClick={handleConfirmVote}
        disabled={!selectedPlayerId}
        variant="secondary" // Red for "Kill/Vote" action
        style={{
          padding: "15px 60px",
          borderRadius: "50px",
          fontSize: "1.2rem",
          boxShadow: selectedPlayerId
            ? `0 4px 20px ${theme.colors.secondary}60`
            : "none",
        }}
      >
        VOTE NOW 🔪
      </PrimaryButton>
    </div>
  );
};

export default ConfirmVoteButton;
