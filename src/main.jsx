import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./RandomApp.jsx";
import TimeApp from "./TimeApp.jsx";
import "./index.css";

const Main = () => {
  // Load last viewed page from localStorage or default to true (App)
  const [showApp, setShowApp] = useState(() => {
    return localStorage.getItem("lastViewed") === "TimeApp" ? false : true;
  });

  // Save current page to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("lastViewed", showApp ? "App" : "TimeApp");
  }, [showApp]);

  return (
    <>
      <button
        className="swap-button"
        onClick={() => setShowApp(!showApp)}
      ></button>
      <div>
        <div>
          {showApp ? <App /> : <TimeApp />}
        </div>
      </div>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
