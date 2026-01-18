import { type ReactNode, type CSSProperties } from "react";
import { theme } from "../../styles/theme";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
}

export const Card = ({ children, style }: CardProps) => {
  return (
    <div
      style={{
        backgroundColor: theme.colors.surface, // #1e1e1e
        borderRadius: theme.borderRadius.l, // 16px
        padding: theme.spacing.l, // 24px
        boxShadow: theme.shadows.card,
        color: theme.colors.text.primary,
        border: `1px solid ${theme.colors.border}`, // Borda sutil para definição
        position: "relative",
        overflow: "hidden", // Garante que nada vaze do card
        ...style,
      }}
    >
      {/* Detalhe visual opcional: Uma borda fina colorida no topo */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
        }}
      />

      {children}
    </div>
  );
};
