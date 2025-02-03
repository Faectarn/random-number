import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./RandomApp.jsx";
import TimeApp from "./TimeApp.jsx";
import "./index.css";

const Main = () => {
  const [showApp, setShowApp] = useState(true);

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      {/* Växlingsknappen */}
      <button
        onClick={() => setShowApp(!showApp)}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          backgroundColor: "red",
          color: "white",
          fontSize: "16px",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        ↔
      </button>

      {/* Renderar den aktuella appen */}
      <div style={{ textAlign: "center", marginTop: "5rem" }}>
        {showApp ? <App /> : <TimeApp />}
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
