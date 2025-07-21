import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./RandomApp.jsx";
import TimeApp from "./TimeApp.jsx";
import AttributeGenerator from "./AttributeGenerator";
import MatchSimulator from "./MatchSimulator";  // Lägg till din simulator
import "./index.css";

const Main = () => {
  const [showApp, setShowApp] = useState(() => {
    return localStorage.getItem("lastViewed") === "TimeApp" ? false : true;
  });

  const [showAG, setShowAG] = useState(false);
  const [showMS, setShowMS] = useState(false); // Ny state för MatchSimulator

  useEffect(() => {
    localStorage.setItem("lastViewed", showApp ? "App" : "TimeApp");
  }, [showApp]);

  return (
    <>
      <div className="controls">
        <button
          className="swap-button"
          onClick={() => {
            setShowAG(false);
            setShowMS(false);
            setShowApp(prev => !prev);
          }}
        >
          {/* Swap */}
        </button>
        <button
          className="swap-button ag-button"
          onClick={() => {
            setShowMS(false);
            setShowAG(prev => !prev);
          }}
        >
          AGs
        </button>
        <button
          className="swap-button ms-button"
          onClick={() => {
            setShowAG(false);
            setShowMS(prev => !prev);
          }}
        >
          MS
        </button>
      </div>

      {/* Conditionally render */}
      {showAG ? (
        <AttributeGenerator />
      ) : showMS ? (
        <MatchSimulator />
      ) : showApp ? (
        <App />
      ) : (
        <TimeApp />
      )}
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
