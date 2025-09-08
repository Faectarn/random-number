import React, { useState } from "react";
import {
  cyberpunkAttributes,
  avowedAttributes,
  dragonageAttributes,
} from "./AttributeLists";

const AttributeGenerator = () => {
  const [results, setResults] = useState({});
  const [activeList, setActiveList] = useState(null);

  const getBiasedPercent = (min = -100, max = 100, step = 5) => {
    const weights = [];

    // Max avstånd från 0
    const maxDistance = min < 0 ? Math.max(Math.abs(min), Math.abs(max)) : max;

    for (let i = min; i <= max; i += step) {
      const distance = Math.abs(i);
      const weight = Math.round((maxDistance - distance) / step + 1);
      for (let j = 0; j < weight; j++) {
        weights.push(i);
      }
    }

    const index = Math.floor(Math.random() * weights.length);
    return weights[index];
  };

  const getRandomValue = (item, currentResults = {}) => {
    if (item.options) {
      const index = Math.floor(Math.random() * item.options.length);
      return item.options[index];
    }

    if (item.dependentOn) {
      const baseValue = currentResults[item.dependentOn] ?? 0;
      const max = Math.max(0, 100 - baseValue);
      return Math.floor(Math.random() * (max + 1));
    }

    // For dependentSum: third value = 100 - sum of others
    if (item.dependentSum) {
      const sum = item.dependentSum
        .map((key) => currentResults[key] || 0)
        .reduce((a, b) => a + b, 0);
      return Math.max(0, 100 - sum);
    }

    const { min = 0, max, step = 1 } = item;

    if (item.percent) {
      return getBiasedPercent(min, max, step);
    }

    const steps = Math.floor((max - min) / step) + 1;
    const index = Math.floor(Math.random() * steps);
    return min + index * step;
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
