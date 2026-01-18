import { type InputHTMLAttributes, useState } from "react";
import { theme } from "../../styles/theme";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = ({ style, ...props }: InputProps) => {
  // Estado local para controlar o visual de foco (já que inline styles não suportam :focus)
  const [isFocused, setIsFocused] = useState(false);

  return (
    <input
      {...props}
      // Mantemos os eventos originais caso passem via props, mas injetamos nossa lógica
      onFocus={(e) => {
        setIsFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        props.onBlur?.(e);
      }}
      style={{
        // Layout
        width: "100%",
        padding: theme.spacing.m,
        boxSizing: "border-box", // Garante que o padding não quebre o layout

        // Tipografia
        fontSize: theme.fontSize.m,
        fontFamily: "inherit",

        // Cores e Bordas
        backgroundColor: "#151515", // Um pouco mais escuro que o cartão para dar profundidade
        color: theme.colors.text.primary,
        borderRadius: theme.borderRadius.m,

        // A mágica da borda dinâmica
        border: `2px solid ${isFocused ? theme.colors.primary : theme.colors.border}`,
        outline: "none", // Remove o outline feio padrão do navegador

        // Transição suave
        transition: "all 0.2s ease-in-out",
        boxShadow: isFocused ? `0 0 10px ${theme.colors.primary}40` : "none", // Brilho sutil ao focar

        // Permite sobrescrever estilos (como o width fixo do código da sala)
        ...style,
      }}
    />
  );
};
