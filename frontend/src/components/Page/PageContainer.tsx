import { type ReactNode } from "react";
import { theme } from "../../styles/theme";

export const PageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div
      style={{
        // Ocupa toda a altura
        minHeight: "100vh",
        width: "100%",

        // FUNDO: Gradiente Radial (Foco no centro, bordas escuras)
        // Isso cria imersão e resolve a sensação de "site vazio" no PC
        background: `radial-gradient(circle at center, ${theme.colors.background} 0%, #000000 100%)`,

        color: theme.colors.text.primary,

        // FLEXBOX: Centraliza tudo
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center", // Centraliza verticalmente no PC

        fontFamily: "'Inter', sans-serif",
        overflowX: "hidden", // Evita scroll horizontal indesejado
        position: "relative",
      }}
    >
      {/* Elemento decorativo opcional (Grid de fundo bem sutil) 
         Dá uma textura "Tech" sem poluir
      */}
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
          pointerEvents: "none", // O clique passa através
          zIndex: 0,
        }}
      />

      {/* CONTAINER DO CONTEÚDO */}
      <div
        style={{
          width: "100%",
          // No PC: Fica contido em 600px (ideal para jogos de dedução/cartas)
          // No Celular: Ocupa quase tudo
          maxWidth: "600px",

          // Padding dinâmico: Menor no celular (16px), maior no PC (32px)
          padding: "20px",

          // Garante que o conteúdo fique acima do grid decorativo
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing.m,

          // Animação de entrada suave (Fade In)
          animation: "fadeIn 0.5s ease-out",
        }}
      >
        {/* Style Tag para animações globais rápidas */}
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
