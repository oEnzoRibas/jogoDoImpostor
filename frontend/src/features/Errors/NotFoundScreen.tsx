import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../../components/Buttons/PrimaryButton";
import { theme } from "../../styles/theme";

export const NotFoundScreen = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: theme.colors.background,
        color: theme.colors.text.primary,
        padding: theme.spacing.l,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Elemento de Fundo Decorativo (Estrelas ou Ruído) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "radial-gradient(circle at center, transparent 0%, #000 100%)",
          opacity: 0.6,
          zIndex: 0,
        }}
      />

      <div
        style={{
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: theme.spacing.l,
        }}
      >
        {/* Ícone Animado */}
        <div
          style={{
            fontSize: "80px",
            marginBottom: theme.spacing.m,
            animation: "float 2s ease-in-out infinite",
          }}
        >
          🐱‍🚀
        </div>

        <h1
          style={{
            fontSize: "6rem",
            margin: 0,
            lineHeight: 1,
            color: theme.colors.primary,
            textShadow: `0 0 20px ${theme.colors.primary}40`,
            fontFamily: "monospace",
            letterSpacing: "-5px",
            animation: "float 4.5s ease-in-out infinite",
          }}
        >
          404
        </h1>

        <div style={{ maxWidth: "400px" }}>
          <h2
            style={{
              fontSize: theme.fontSize.xl,
              marginBottom: theme.spacing.s,
            }}
          >
            Oops! You've ventured into unknown territory.
          </h2>
          <p style={{ color: theme.colors.text.secondary, lineHeight: "1.6" }}>
            The page you are looking for does not exist. Maybe you have been
            caught by an disguised <strong>Impostor</strong>.
          </p>
        </div>

        <div
          style={{
            marginTop: theme.spacing.m,
            width: "100%",
            maxWidth: "300px",
          }}
        >
          <PrimaryButton
            onClick={() => {
              window.location.href = "/";
              console.log("Navigating back to home");
            }}
            fullWidth
          >
            BACK TO HOME 🚀
          </PrimaryButton>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>
    </div>
  );
};
