import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./RandomApp.jsx";
import TimeApp from "./TimeApp.jsx";
import AttributeGenerator from "./AttributeGenerator";
import {
  cyberpunkAttributes,
  avowedAttributes,
} from "./attributeLists";
import "./index.css";

const Main = () => {
  // True = show App, false = show TimeApp (unless showAG is true)
  const [showApp, setShowApp] = useState(() => {
    return localStorage.getItem("lastViewed") === "TimeApp" ? false : true;
  });
  // True = show attribute generator
  const [showAG, setShowAG] = useState(false);

  // Persist lastViewed key only for App vs TimeApp
  useEffect(() => {
    localStorage.setItem("lastViewed", showApp ? "App" : "TimeApp");
  }, [showApp]);

  return (
    <>
      <div className="controls">
        {/* Toggle between App and TimeApp */}
        <button
          className="swap-button"
          onClick={() => {
            setShowAG(false);
            setShowApp(prev => !prev);
          }}
        >
        </button>
        {/* Show AttributeGenerator */}
        <button
          className="swap-button ag-button"
          onClick={() => setShowAG(prev => !prev)}
        >
          AGs
        </button>

      </div>

      {/* Conditionally render */}
      {showAG ? (
        <div>
          <AttributeGenerator />
        </div>
      ) : (
        showApp ? <App /> : <TimeApp />
      )}
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
