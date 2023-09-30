import { useState } from 'react';
import './App.css';

function App() {
  const [maxNumber, setMaxNumber] = useState(null);
  const [randomNumber, setRandomNumber] = useState(null);
  const [shuffling, setShuffling] = useState(false);

  const handleNumberSelectAndGenerate = (num) => {
    if (shuffling) return;
    setMaxNumber(num);
    setShuffling(true);
    let count = 0;
    const intervalId = setInterval(() => {
      setRandomNumber(Math.floor(Math.random() * num) + 1);
      count += 1;
      if (count > 10) {
        clearInterval(intervalId);
        setShuffling(false);
      }
    }, 50);
  };

  return (
    <>
      {/* <h1>Vite + React</h1> */}
      <div className="card">
        <div className="button-row">
          {Array.from({ length: 9 }, (_, i) => i + 2).map((num) => (
            <button 
              key={num} 
              onClick={() => handleNumberSelectAndGenerate(num)} 
              disabled={shuffling} 
              className={num === maxNumber ? 'selected' : ''}>
              {num}
            </button>
          ))}
        </div>
        <div className="number-row">
          {maxNumber && Array.from({ length: maxNumber }, (_, i) => i + 1).map((num) => (
            <span key={num} className={randomNumber === num ? 'highlight' : ''}>
              {num}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
