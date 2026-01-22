import { theme } from "../../../../../styles/theme";

interface Props {
  title: string;
  icon?: string;
  count?: number;
  preview?: string[];
  isCustom?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export const ThemeCard = ({
  title,
  icon,
  count,
  preview,
  isCustom = false,
  onClick,
  onEdit,
  onDelete,
}: Props) => {
  const displayIcon = icon || "🎲";

  return (
    <div
      onClick={onClick}
      className="theme-card"
      style={{
        background: isCustom
          ? `linear-gradient(145deg, ${theme.colors.surface}, rgba(30,30,30,1))`
          : `linear-gradient(145deg, #2a2a2a, #1a1a1a)`,
        border: `1px solid ${isCustom ? theme.colors.primary + "40" : theme.colors.border}`,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.m,
        cursor: "pointer",
        position: "relative",
        transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "130px",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 10px 20px rgba(0,0,0,0.3)`;
        e.currentTarget.style.borderColor = isCustom
          ? theme.colors.primary
          : theme.colors.text.secondary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = isCustom
          ? theme.colors.primary + "40"
          : theme.colors.border;
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flex: 1,
        }}
      >
        {/* --- Header --- */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          <h4
            style={{
              margin: 0,
              color: isCustom ? theme.colors.primary : "white",
              fontSize: "16px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={title}
          >
            {title}
          </h4>

          {isCustom && (
            <span
              style={{
                fontSize: "10px",
                background: theme.colors.primary,
                color: "black",
                padding: "2px 6px",
                borderRadius: "4px",
                fontWeight: "bold",
                flexShrink: 0,
              }}
            >
              USER
            </span>
          )}
        </div>

        {/* --- BODY OF THE CARD --- */}
        {isCustom ? (
          preview && (
            <p
              style={{
                fontSize: "12px",
                color: theme.colors.text.secondary,
                marginTop: "4px",
                lineHeight: "1.4",
                wordBreak: "break-word",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {preview.slice(0, 5).join(", ")}
              {preview.length > 5 && "..."}
            </p>
          )
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              opacity: 0.8,
            }}
          >
            <span style={{ fontSize: "40px" }}>{displayIcon}</span>
          </div>
        )}
      </div>

      {/* --- FOOTER --- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          marginTop: "10px",
        }}
      >
        <span style={{ fontSize: "10px", color: theme.colors.text.disabled }}>
          {count ? `${count} words` : "Default"}
        </span>

        {isCustom && (
          <div style={{ display: "flex", gap: "5px" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              title="Edit"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                padding: "2px",
              }}
            >
              ✏️
            </button>
            <button
              onClick={onDelete}
              title="Delete"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                padding: "2px",
              }}
            >
              🗑️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
