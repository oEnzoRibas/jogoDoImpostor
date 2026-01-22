import { type InputHTMLAttributes, useState } from "react";
import { theme } from "../../styles/theme";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = ({ style, ...props }: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <input
      {...props}
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
        boxSizing: "border-box",

        // Typography
        fontSize: theme.fontSize.m,
        fontFamily: "inherit",

        // Colors & Borders
        backgroundColor: "#151515",
        color: theme.colors.text.primary,
        borderRadius: theme.borderRadius.m,
        border: `2px solid ${isFocused ? theme.colors.primary : theme.colors.border}`,
        outline: "none",

        transition: "all 0.2s ease-in-out",
        boxShadow: isFocused ? `0 0 10px ${theme.colors.primary}40` : "none",
        ...style,
      }}
    />
  );
};
