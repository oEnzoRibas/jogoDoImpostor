import { PrimaryButton } from "../../../../components/Buttons/PrimaryButton";

interface Props {
  onClick: () => void;
}

const StartVotingButton = ({ onClick }: Props) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 40,
        left: 0,
        right: 0,
        padding: 20,
        zIndex: 100,
      }}
    >
      <div
        style={{
          position: "fixed",
          bottom: "40px",
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "center",
          padding: "0 20px",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            pointerEvents: "auto",
          }}
        >
          <PrimaryButton
            onClick={onClick}
            fullWidth
            style={{
              boxShadow: "0 0 20px #ff0000",
              animation: "pulse 2s infinite",
            }}
          >
            🚨 Start Voting
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default StartVotingButton;
