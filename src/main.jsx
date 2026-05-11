import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./RandomApp.jsx";
import TimeApp from "./TimeApp.jsx";
import MatchSimulator from "./MatchSimulator";
import LuckyWheel from "./LuckyWheel";
import "./index.css";

const Main = () => {
  const [selectedView, setSelectedView] = useState(() => {
    const lastViewed = localStorage.getItem("lastViewed");
    return ["TimeApp", "MatchSimulator", "LuckyWheel"].includes(lastViewed)
      ? lastViewed
      : "App";
  });

  useEffect(() => {
    localStorage.setItem("lastViewed", selectedView);
  }, [selectedView]);

  return (
    <>
      <div className="controls">
        <select
          className="page-select"
          value={selectedView}
          onChange={(e) => setSelectedView(e.target.value)}
        >
          <option value="App">Random</option>
          <option value="TimeApp">Time</option>
          <option value="MatchSimulator">MS</option>
          <option value="LuckyWheel">Lyckohjul</option>
        </select>
      </div>

      {selectedView === "MatchSimulator" ? (
        <MatchSimulator />
      ) : selectedView === "LuckyWheel" ? (
        <LuckyWheel />
      ) : selectedView === "App" ? (
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
