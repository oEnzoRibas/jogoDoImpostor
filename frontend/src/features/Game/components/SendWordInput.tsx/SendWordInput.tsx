import { PrimaryButton } from "../../../../components/Buttons/PrimaryButton";
import { Card } from "../../../../components/Card/Card";
import { Input } from "../../../../components/Input/Input";
import { theme } from "../../../../styles/theme";

interface Props {
  wordInput: string;
  setWordInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const SendWordInput = ({ wordInput, setWordInput, handleSubmit }: Props) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: "0 20px",
        boxSizing: "border-box",
        zIndex: 100,
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "500px",
          flexDirection: "row",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          padding: "10px",
          borderRadius: "16px",
          boxShadow: "0 -5px 30px rgba(0,0,0,0.5)",
          border: `1px solid ${theme.colors.accent}`,
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", width: "100%", gap: "10px" }}
        >
          <Input
            placeholder="Write down your word..."
            value={wordInput}
            onChange={(e) => setWordInput(e.target.value)}
            autoFocus
            style={{ marginBottom: 0, flex: 1 }}
          />
          <PrimaryButton type="submit" style={{ padding: "0 20px" }}>
            SEND
          </PrimaryButton>
        </form>
      </Card>
    </div>
  );
};

export default SendWordInput;
