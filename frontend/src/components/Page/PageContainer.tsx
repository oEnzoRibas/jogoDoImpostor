import { type ReactNode } from "react";
import { theme } from "../../styles/theme";

export const PageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: `radial-gradient(circle at center, ${theme.colors.background} 0%, #000000 100%)`,

        color: theme.colors.text.primary,

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        fontFamily: "'Inter', sans-serif",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "600px",

          padding: "20px",

          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing.m,

          animation: "fadeIn 0.5s ease-out",
        }}
      >
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        {children}
      </div>
    </div>
  );
};
