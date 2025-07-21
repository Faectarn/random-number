import React, { useState } from "react";
import "./App.css";

const MatchSimulator = () => {
  const [odds, setOdds] = useState({ home: "2", draw: "2", away: "2" });
  const [highlight, setHighlight] = useState(null);
  const [probabilities, setProbabilities] = useState({});
  const [roll, setRoll] = useState(null);
  const [intervals, setIntervals] = useState({});

  const handleChange = (field, value) => {
    setOdds((prev) => ({ ...prev, [field]: value }));
    setHighlight(null);
    setRoll(null);
  };

  const simulate = () => {
    const { home, draw, away } = odds;
    const oHome = parseFloat(home);
    const oDraw = parseFloat(draw);
    const oAway = parseFloat(away);

    if (!oHome || !oDraw || !oAway) {
      alert("Fyll i alla odds!");
      return;
    }

    const pHome = 1 / oHome;
    const pDraw = 1 / oDraw;
    const pAway = 1 / oAway;
    const total = pHome + pDraw + pAway;

    const homePct = (pHome / total) * 100;
    const drawPct = (pDraw / total) * 100;
    const awayPct = (pAway / total) * 100;

    const formatted = {
      home: homePct.toFixed(1),
      draw: drawPct.toFixed(1),
      away: awayPct.toFixed(1),
    };
    setProbabilities(formatted);

    // Intervallgränser
    const homeEnd = homePct;
    const drawEnd = homeEnd + drawPct;

    const rand = Math.random() * 100;
    setRoll(rand.toFixed(1));

    setIntervals({
      home: [0, homeEnd.toFixed(1)],
      draw: [homeEnd.toFixed(1), drawEnd.toFixed(1)],
      away: [drawEnd.toFixed(1), 100],
    });

    if (rand < homeEnd) {
      setHighlight("home");
    } else if (rand < drawEnd) {
      setHighlight("draw");
    } else {
      setHighlight("away");
    }
  };

  return (
    <div className="match-simulator">
      <h2>Matchsimulator</h2>
      <div className="odds-inputs">
        <input
          type="number"
          placeholder="Hemmavinst"
          value={odds.home}
          onChange={(e) => handleChange("home", e.target.value)}
        />
        <input
          type="number"
          placeholder="Oavgjort"
          value={odds.draw}
          onChange={(e) => handleChange("draw", e.target.value)}
        />
        <input
          type="number"
          placeholder="Bortavinst"
          value={odds.away}
          onChange={(e) => handleChange("away", e.target.value)}
        />
      </div>

      <button className="simulate-button" onClick={simulate}>
        Simulera
      </button>

      {roll && (
        <p className="roll-text">
          🎲 Slump: <strong>{roll}</strong>
        </p>
      )}

      <div className="result-grid">
        <div className={`result-box ${highlight === "home" ? "highlight" : ""}`}>
          Hemma<br />
          {probabilities.home ? `${probabilities.home}%` : "-"}
          {intervals.home && (
            <div className="interval">({intervals.home[0]} – {intervals.home[1]})</div>
          )}
        </div>
        <div className={`result-box ${highlight === "draw" ? "highlight" : ""}`}>
          Oavgjort<br />
          {probabilities.draw ? `${probabilities.draw}%` : "-"}
          {intervals.draw && (
            <div className="interval">({intervals.draw[0]} – {intervals.draw[1]})</div>
          )}
        </div>
        <div className={`result-box ${highlight === "away" ? "highlight" : ""}`}>
          Borta<br />
          {probabilities.away ? `${probabilities.away}%` : "-"}
          {intervals.away && (
            <div className="interval">({intervals.away[0]} – {intervals.away[1]})</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchSimulator;
