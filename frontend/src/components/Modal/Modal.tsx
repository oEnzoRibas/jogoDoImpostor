import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { theme } from "../../styles/theme";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  style?: React.CSSProperties;
}

export const Modal = ({ children, onClose, style }: ModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(5px)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: theme.colors.surface,
          borderRadius: theme.borderRadius.l,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          width: "95%",
          maxWidth: "500px",
          maxHeight: "90vh",
          ...style,
        }}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};
