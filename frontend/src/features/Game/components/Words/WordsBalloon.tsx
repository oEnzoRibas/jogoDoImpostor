import { useEffect, useState } from "react";

interface Props {
  player: {
    id: string;
  };

  me: {
    id: string;
  };

  wordsList: string[];
  lastWord: string;
  theme: {
    colors: {
      primary: string;
    };
  };

  isHovered: boolean;
  setHoveredPlayerId: (id: string | null) => void;
}

const WordsBalloon = (props: Props) => {
  const [showFullWord, setShowFullWord] = useState(false);

  useEffect(() => {
    setShowFullWord(true);

    const timer = setTimeout(() => {
      setShowFullWord(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [props.lastWord]);

  return (
    <div
      onMouseEnter={() => props.setHoveredPlayerId(props.player.id)}
      onMouseLeave={() => props.setHoveredPlayerId(null)}
      onClick={() =>
        props.setHoveredPlayerId(props.isHovered ? null : props.player.id)
      }
      style={{
        position: "absolute",
        bottom: "100%",
        marginBottom: "10px",
        background: "white",
        color: "#000",
        padding: "8px 12px",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: "bold",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        zIndex: 10,
        cursor: "pointer",
        minWidth: "60px",
        textAlign: "center",
        border: `2px solid ${props.player.id === props.me.id ? props.theme.colors.primary : "#fff"}`,
        maxWidth: "160px",
        wordBreak: "break-word",
        overflowWrap: "anywhere",
        whiteSpace: "normal",
        lineHeight: "1.2",
      }}
    >
      {props.isHovered ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              color: "#888",
              borderBottom: "1px solid #eee",
            }}
          >
            HISTORY
          </span>
          {props.wordsList.map((w, i) => (
            <span
              key={i}
              style={{
                color: i === props.wordsList.length - 1 ? "#000" : "#666",
              }}
            >
              {w}
            </span>
          ))}
        </div>
      ) : showFullWord ? (
        <span>{props.lastWord}</span>
      ) : (
        <span style={{ fontSize: "20px", lineHeight: "1" }}>💬</span>
      )}
      {/* Triângulo do balão */}
      <div
        style={{
          position: "absolute",
          bottom: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: "6px solid white",
        }}
      />
    </div>
  );
};

export default WordsBalloon;
