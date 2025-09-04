import React, { useState } from "react";
import {
  cyberpunkAttributes,
  avowedAttributes,
  dragonageAttributes,
} from "./AttributeLists";

const AttributeGenerator = () => {
  const [results, setResults] = useState({});
  const [activeList, setActiveList] = useState(null);


  const getRandomValue = (item) => {
    if (item.options) {
      const index = Math.floor(Math.random() * item.options.length);
      return item.options[index];
    }

    const { min = 0, max, step = 1 } = item;
    const steps = Math.floor((max - min) / step) + 1;
    const index = Math.floor(Math.random() * steps);
    return min + index * step;
  };

  const generateFromList = (list) => {
    const newResults = [];

    list.forEach((item, idx) => {
      if (item.type === "header" || item.type === "small-header") return;

      const value = getRandomValue(item);
      newResults.push({
        name: item.name,
        label: item.label,
        value,
        percent: item.percent,
        idx, // <--- unique index reference
      });
    });

    setResults(newResults);
  };



  return (
    <div className="attribute-generator">
      <button
        className="cp2077"
        onClick={() => {
          generateFromList(cyberpunkAttributes);
          setActiveList(cyberpunkAttributes);
        }}
      >
        CP2077
      </button>
      <button
        className="avowed"
        onClick={() => {
          generateFromList(avowedAttributes);
          setActiveList(avowedAttributes);
        }}
      >
        Avowed
      </button>
      <button
        className="dragonAge"
        onClick={() => {
          generateFromList(dragonageAttributes);
          setActiveList(dragonageAttributes);
        }}
      >
        DragonAge
      </button>

     {results.length > 0 && activeList && (
  <div className="result">
    {activeList.map((item, idx) => {
      if (item.type === "header") {
        return <h3 key={idx} className="section-header">{item.label}</h3>;
      }
      if (item.type === "small-header") {
        return <h4 key={idx} className="section-small-header">{item.label}</h4>;
      }

      const resultItem = results.find(
        (r) => r.name === item.name && r.idx === idx
      );
      if (!resultItem) return null;

      const displayValue = resultItem.percent
        ? `${resultItem.value}%`
        : resultItem.value;

      return (
        <div className="attribute" key={idx}>
          <div className="attr-label">
            <p>{item.label || item.name}</p>
          </div>
          <div className="attr-result">
            <strong>{displayValue}</strong>
          </div>
        </div>
      );
    })}
  </div>
)}


    </div>
  );
};

export default AttributeGenerator;
