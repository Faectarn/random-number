import React, { useState } from "react";
import { cyberpunkAttributes, avowedAttributes } from "./AttributeLists";

const AttributeGenerator = () => {
  const [results, setResults] = useState({});

  const getRandomNumber = (range) => {
    if (range.includes("-")) {
      const [min, max] = range.split("-").map(Number);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
      const max = Number(range);
      return Math.floor(Math.random() * max) + 1;
    }
  };

  const generateFromList = (attributes) => {
    const newResults = {};
    for (const key in attributes) {
      newResults[key] = getRandomNumber(attributes[key]);
    }
    setResults(newResults);
  };

  return (
    <div className="attribute-generator">
      <button className="cp2077" onClick={() => generateFromList(cyberpunkAttributes)}>CP2077</button>
      <button className="avowed" onClick={() => generateFromList(avowedAttributes)}>Avowed</button>

      {Object.keys(results).length > 0 && (
        <div className="result">
          {Object.entries(results).map(([attr, value]) => (
            <div className="attribute" key={attr}>
              <div className="attr-label">
                <p>{attr}</p>
              </div>
              <div className="attr-result">
                <strong>{value}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttributeGenerator;
