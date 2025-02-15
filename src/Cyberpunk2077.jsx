import React, { useState } from "react";

const AttributeGenerator = () => {
  // Define the attributes with their ranges. 
  // For a single number, we roll from 1 to that number.
  // For ranges (like "3-7"), we roll between the two numbers (inclusive).
  const attributes = {
    "Skin tone (12):": "12",
    "Skin type (5):": "5",
    "Hairstyle (51):": "51",
    "Hair color (35):": "35",
    "Eyes (21):": "21",
    "Eye color (9):": "9",
    "Eyebrows (13):": "13",
    "Nose (21):": "21",
    "Mouth (21):": "21",
    "Jaw (21):": "21",
    "Ears (21):": "21",
    "Beard (13):": "13",
    "Beard style (3/7):": "3-7",
    // "Cyberware (10):": "10",
    "Facial scars (14):": "14",
    "Facial tatoos (16):": "16",
    "Blemishes (4):": "4",
    "Blemisher color (6):": "6",
    "Body tattoos (8):": "8",
    "Body scars (3):": "3"
  };

  const [results, setResults] = useState({});

  // Helper function to generate a random number based on a range string.
  const getRandomNumber = (range) => {
    if (range.includes("-")) {
      const [min, max] = range.split("-").map(Number);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
      const max = Number(range);
      return Math.floor(Math.random() * max) + 1;
    }
  };

  // Generate a random value for each attribute and update state.
  const generateAttributes = () => {
    const newResults = {};
    for (const key in attributes) {
      newResults[key] = getRandomNumber(attributes[key]);
    }
    setResults(newResults);
  };

  return (
    <div className="attribute-generator">
      <button onClick={generateAttributes}>CP2077</button>
      <div className="result">
        {Object.keys(results).length > 0 ? (
          Object.entries(results).map(([attr, value]) => (
            <div className="attribute" key={attr}>
              <div className="attr-label">
                <p>{attr}</p>
              </div>
              <div className="attr-result">
              <strong>
                {value}
                </strong>
              </div>
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
  
};

export default AttributeGenerator;
