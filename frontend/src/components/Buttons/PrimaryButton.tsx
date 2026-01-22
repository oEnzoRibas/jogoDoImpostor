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

  const isPrimary = variant === "primary";

  const backgroundColor = isPrimary
    ? theme.colors.primary
    : theme.colors.secondary;

  const textColor = isPrimary ? "#000000" : "#ffffff"; 

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: fullWidth ? "100%" : "auto",
        padding: `${theme.spacing.m} ${theme.spacing.l}`,

        backgroundColor: backgroundColor,
        color: textColor,

        border: "none",
        borderRadius: theme.borderRadius.m,
        fontSize: theme.fontSize.m,
        fontWeight: "bold",
        fontFamily: "inherit",
        textTransform: "uppercase",
        letterSpacing: "1px",

        // Interatividade
        cursor: props.disabled ? "not-allowed" : "pointer",
        opacity: props.disabled ? 0.5 : isHovered ? 0.9 : 1,
        transform:
          isHovered && !props.disabled ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.2s ease",
        boxShadow:
          isHovered && !props.disabled
            ? `0 4px 15px ${backgroundColor}60`
            : "none",

        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};
