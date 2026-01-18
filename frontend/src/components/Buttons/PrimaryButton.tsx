import { type ButtonHTMLAttributes, useState } from "react";
import { theme } from "../../styles/theme";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
}

export const PrimaryButton = ({
  variant = "primary",
  fullWidth,
  style,
  children,
  ...props
}: PrimaryButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Define as cores com base na variante
  // Primary = Verde (Criar)
  // Secondary = Vermelho (Entrar/Impostor) ou Cinza Escuro
  const isPrimary = variant === "primary";

  const backgroundColor = isPrimary
    ? theme.colors.primary
    : theme.colors.secondary; // Ou use "#333" se quiser o botão de entrar neutro

  const textColor = isPrimary
    ? "#000000" // Texto preto no verde fica melhor contraste
    : "#ffffff"; // Texto branco no vermelho

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        // Layout
        width: fullWidth ? "100%" : "auto",
        padding: `${theme.spacing.m} ${theme.spacing.l}`,

        // Cores
        backgroundColor: backgroundColor,
        color: textColor,

        // Bordas e Fontes
        border: "none",
        borderRadius: theme.borderRadius.m,
        fontSize: theme.fontSize.m,
        fontWeight: "bold",
        fontFamily: "inherit",
        textTransform: "uppercase",
        letterSpacing: "1px",

        // Interatividade
        cursor: props.disabled ? "not-allowed" : "pointer",
        opacity: props.disabled ? 0.5 : isHovered ? 0.9 : 1, // Efeito de hover simples
        transform:
          isHovered && !props.disabled ? "translateY(-2px)" : "translateY(0)", // Leve subida
        transition: "all 0.2s ease",
        boxShadow:
          isHovered && !props.disabled
            ? `0 4px 15px ${backgroundColor}60` // Brilho colorido ao passar o mouse
            : "none",

        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};
