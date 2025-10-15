import { useState } from "react";
import "./App.css";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [numRandoms, setNumRandoms] = useState(1);
  const [maxNumber, setMaxNumber] = useState(null);
  const [randomNumbers, setRandomNumbers] = useState([]);
  const [shuffling, setShuffling] = useState(false);
  const [pickedNumbers, setPickedNumbers] = useState([]);
  const [ignoredNumbers, setIgnoredNumbers] = useState([]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const pool = (limit) =>
    Array.from({ length: limit }, (_, i) => i + 1).filter(
      (n) => !ignoredNumbers.includes(n) && !pickedNumbers.includes(n)
    );

  const handleNumberSelectAndGenerate = (num) => {
    resetNumbers();
    if (shuffling || num < numRandoms) return;

    setMaxNumber(num);
    setShuffling(true);

    let count = 0;
    let finalPick = [];

    const intervalId = setInterval(() => {
      const possible = pool(num);
      if (possible.length === 0) {
        clearInterval(intervalId);
        setShuffling(false);
        return;
      }
      shuffleArray(possible);
      finalPick = possible.slice(0, Math.min(numRandoms, possible.length));
      setRandomNumbers(finalPick);

      count += 1;
      if (count > 6) {
        clearInterval(intervalId);
        // ✅ only now we commit them as picked
        setPickedNumbers((prev) => [...prev, ...finalPick]);
        setShuffling(false);
      }
    }, 75);
  };

  const pickFromRemaining = () => {
    if (shuffling || !maxNumber) return;

    setShuffling(true);

    let count = 0;
    let finalPick = [];

    const intervalId = setInterval(() => {
      const remaining = pool(maxNumber);
      if (remaining.length === 0) {
        clearInterval(intervalId);
        setShuffling(false);
        return;
      }
      shuffleArray(remaining);
      finalPick = remaining.slice(0, Math.min(numRandoms, remaining.length));
      setRandomNumbers(finalPick);

      count += 1;
      if (count > 6) {
        clearInterval(intervalId);
        // ✅ commit after animation
        setPickedNumbers((prev) => [...prev, ...finalPick]);
        setShuffling(false);
      }
    }, 75);
  };

  const handleInputChange = (e) => setInputValue(e.target.value);
  const handleNumRandomsChange = (e) =>
    setNumRandoms(Math.max(1, parseInt(e.target.value, 10) || 1));

  const handleSubmit = () => {
    const num = parseInt(inputValue, 10);
    if (!isNaN(num) && num > 0) handleNumberSelectAndGenerate(num);
  };

  const getSpecialNumber = (divider) =>
    Math.ceil((randomNumbers[0] || 1) / divider);

  const resetNumbers = () => {
    setPickedNumbers([]);
    setRandomNumbers([]);
  };

  return (
    <>
      <div className="card">
        <div className="numbers">
          Numbers to generate:
          <input
            className="small-input"
            type="number"
            onChange={handleNumRandomsChange}
            placeholder="1"
            min="1"
            disabled={shuffling}
          />
        </div>

        <div className="button-grid">
          {Array.from({ length: 9 }, (_, i) => i + 2).map((num) => (
            <button
              key={num}
              onClick={() => handleNumberSelectAndGenerate(num)}
              disabled={shuffling}
              className={num === maxNumber ? "selected" : ""}
            >
              {num}
            </button>
          ))}
        </div>

        <div className="input-section">
          <input
            className="number-input"
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="10"
            min="10"
            disabled={shuffling}
          />
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={shuffling}
          >
            Shuffle
          </button>

          {(randomNumbers.length > 0 || pickedNumbers.length > 0) && (
            <>
              <button
                className="submit-button"
                onClick={pickFromRemaining}
                disabled={shuffling || !maxNumber}
              >
                Continue
              </button>
              <button
                className="submit-button"
                onClick={() => {
                  resetNumbers();
                }}
                disabled={shuffling || !maxNumber}
              >
                Reset
              </button>
            </>
          )}
        </div>

        <section className="special-numbers">
          {maxNumber === 12 && !shuffling && (
            <>
              <div className="number-row">
                {Array.from({ length: 2 }, (_, i) => i + 1).map((num) => (
                  <span
                    key={`1-2-${num}`}
                    className={getSpecialNumber(6) === num ? "highlight2" : ""}
                  >
                    {num}
                  </span>
                ))}
              </div>
              <div className="number-row">
                {Array.from({ length: 3 }, (_, i) => i + 1).map((num) => (
                  <span
                    key={`1-3-${num}`}
                    className={getSpecialNumber(4) === num ? "highlight2" : ""}
                  >
                    {num}
                  </span>
                ))}
              </div>
              <div className="number-row">
                {Array.from({ length: 4 }, (_, i) => i + 1).map((num) => (
                  <span
                    key={`1-4-${num}`}
                    className={getSpecialNumber(3) === num ? "highlight2" : ""}
                  >
                    {num}
                  </span>
                ))}
              </div>
            </>
          )}
        </section>

        <div className="number-row">
          {maxNumber &&
            maxNumber <= 99 &&
            Array.from({ length: maxNumber }, (_, i) => i + 1).map((num) => (
              <span
                key={num}
                className={`
    ${randomNumbers.includes(num) ? "highlight" : ""}
    ${
      pickedNumbers.includes(num) && !randomNumbers.includes(num)
        ? "grayed-out"
        : ""
    }
  `}
              >
                {num}
              </span>
            ))}
          {maxNumber &&
            maxNumber > 99 &&
            randomNumbers.map((num, index) => (
              <span key={index} className="highlight">
                {num}
              </span>
            ))}
        </div>
      </div>
    </>
  );
}

export default App;
