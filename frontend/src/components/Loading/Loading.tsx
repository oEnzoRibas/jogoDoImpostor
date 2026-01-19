import { PageContainer } from "../Page/PageContainer";

const Loading = () => {
  return (
    <PageContainer>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div style={{ fontSize: "60px", animation: "spin 2s infinite linear" }}>
          🛸
        </div>
        <p
          style={{
            color: "white",
            fontFamily: "monospace",
            letterSpacing: "2px",
          }}
        >
          CONECTANDO À NAVE...
        </p>
        <style>{`@keyframes spin { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }`}</style>
      </div>
    </PageContainer>
  );
};

export default Loading;
