import { useGame } from "../../context/GameContext";
import { socketService } from "../../services/socket";

const ResultsScreen = () => {
  const { room, me, createRoom, gameState } = useGame();

  if (!room || !room.gameResults) return <div>Calculando resultados...</div>;

  const { winner, impostorId, votes } = room.gameResults;

  const impostorWon = winner === "IMPOSTOR";
  const iWon =
    (impostorWon && me?.isImpostor) || (!impostorWon && !me?.isImpostor);
  const bgColor = impostorWon ? "#7f1d1d" : "#14532d"; // Vermelho escuro ou Verde escuro
  const impostorName =
    room.players.find((p) => p.id === impostorId)?.name || "Desconhecido";

  const handleBackToLobby = () => {
    createRoom(me?.name || "Host");
  };

  return (
    <div
      style={{
        textAlign: "center",
        color: "white",
        padding: "40px 20px",
        background: `linear-gradient(to bottom, ${bgColor}, #111)`,
        minHeight: "100vh",
      }}
    >
      {/* CABEÇALHO DO RESULTADO */}
      GAMESTATE : {gameState}
      <h1 style={{ fontSize: "4rem", margin: "0 0 10px 0" }}>
        {impostorWon ? "VITÓRIA DO IMPOSTOR!" : "OS INOCENTES VENCERAM!"}
      </h1>
      <h2 style={{ color: iWon ? "#4ade80" : "#fca5a5" }}>
        {iWon ? "🏆 Parabéns, você venceu!" : "☠️ Você perdeu..."}
      </h2>
      {/* REVELAÇÃO DO IMPOSTOR */}
      <div
        style={{
          margin: "40px 0",
          padding: "20px",
          background: "rgba(0,0,0,0.3)",
          borderRadius: "15px",
          display: "inline-block",
        }}
      >
        <p style={{ margin: 0, color: "#aaa", fontSize: "14px" }}>
          O IMPOSTOR ERA:
        </p>
        <div
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            marginTop: "5px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          😈 {impostorName}
        </div>
      </div>
      {/* QUEM VOTOU EM QUEM */}
      <h3>Votos da Rodada:</h3>
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {room.players.map((player) => {
          const votedTargetId = votes[player.id];
          const votedTargetName =
            room.players.find((p) => p.id === votedTargetId)?.name || "Ninguém";

          return (
            <div
              key={player.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 20px",
                background: "#333",
                borderRadius: "8px",
              }}
            >
              <span style={{ fontWeight: "bold" }}>{player.name}</span>
              <span style={{ color: "#aaa" }}>votou em ➡️</span>
              <span
                style={{
                  color: votedTargetId === impostorId ? "#4ade80" : "#ef4444",
                  fontWeight: "bold",
                }}
              >
                {votedTargetName}
              </span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: "50px",
          display: "flex",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        {me?.isHost && (
          <button
            onClick={handleBackToLobby}
            style={{
              padding: "15px 30px",
              fontSize: "18px",
              background: "white",
              color: "black",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Jogar Novamente 🔄
          </button>
        )}

        <button
          onClick={() => socketService.disconnect()}
          style={{
            padding: "15px 30px",
            fontSize: "18px",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Sair do Jogo ❌
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
