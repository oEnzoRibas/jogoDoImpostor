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
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.l,
        padding: theme.spacing.l,
        boxShadow: theme.shadows.card,
        color: theme.colors.text.primary,
        border: `1px solid ${theme.colors.border}`,
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
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
