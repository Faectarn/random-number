import React, { useState } from "react";
import {
  cyberpunkAttributes,
  avowedAttributes,
  dragonageAttributes,
} from "./AttributeLists";

const AttributeGenerator = () => {
  const [results, setResults] = useState({});
  const [activeList, setActiveList] = useState(null);

const getBiasedPercent = (min = 0, max = 100, step = 1) => {
  const r1 = Math.random();
  const r2 = Math.random();

  // Biased value between 0 and 1 (centered around 0)
  const biased = Math.abs(r1 - r2);

  // Scale to range
  const range = max - min;
  const raw = min >= 0
    ? biased * range               // if min is 0 or higher, force positive
    : (Math.random() < 0.5 ? -1 : 1) * biased * range; // allow negative

  // Round to nearest step
  const stepped = Math.round(raw / step) * step;

  // Clamp to valid range
  const final = Math.min(max, Math.max(min, stepped));
  return final;
};

  const getRandomValue = (item, currentResults = {}) => {
const getBiasedPercent = (min = 0, max = 100, step = 1) => {
  const r1 = Math.random();
  const r2 = Math.random();

  // Triangle distribution favoring values near 0
  const biased = Math.pow(Math.abs(r1 - r2), 1.5); // skew stronger toward 0

  // Always positive if min >= 0, otherwise symmetric
  const raw = min >= 0
    ? biased * (max - min)
    : (Math.random() < 0.5 ? -1 : 1) * biased * (max - min);

  // Round to nearest step
  const stepped = Math.round(raw / step) * step;

  // Clamp
  const final = Math.min(max, Math.max(min, stepped));
  return final;
};

  const generateFromList = (list) => {
    const newResults = [];

    list.forEach((item, idx) => {
      if (item.type === "header" || item.type === "small-header") return;

      const currentMap = Object.fromEntries(
        newResults.map((r) => [r.name, r.value])
      );

      const value = getRandomValue(item, currentMap);

      newResults.push({
        name: item.name,
        label: item.label,
        value,
        percent: item.percent,
        idx,
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
              return (
                <h3 key={idx} className="section-header">
                  {item.label}
                </h3>
              );
            }
            if (item.type === "small-header") {
              return (
                <h4 key={idx} className="section-small-header">
                  {item.label}
                </h4>
              );
            }

            // 🚫 Hide the variants
            if (
              item.name === "Head Shape Variant A" ||
              item.name === "Head Shape Variant B"
            ) {
              return null;
            }

            const resultItem = results.find((r) => r.name === item.name);
            if (!resultItem) return null;

            let displayValue = resultItem.value;

            // ✅ Special combined format
            if (resultItem.name === "Head Shape Base") {
              const base = resultItem.value;
              const variant =
                results.find((r) => r.name === "Head Shape Variant A")?.value ||
                0;
              const remainder =
                results.find((r) => r.name === "Head Shape Variant B")?.value ||
                0;
              displayValue = `${base}:${variant}:${remainder}`;
            } else if (resultItem.percent) {
              displayValue = `${displayValue}%`;
            }

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
