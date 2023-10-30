import { useState } from 'react';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
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

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    const num = parseInt(inputValue, 10);
    if (!isNaN(num) && num > 0) {
      handleNumberSelectAndGenerate(num);
    }
  };

  return (
    <>
      <h3>Random number generator</h3>
      <div className="card">
        <div className="button-grid">
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
        <div className="input-section">
          <input
            className='number-input'
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="10"
            min="10"
            disabled={shuffling}
          />
          <button className="submit-button" onClick={handleSubmit} disabled={shuffling}>Shuffle</button>
        </div>
        <div className="number-row">
          {maxNumber && maxNumber <= 10 && Array.from({ length: maxNumber }, (_, i) => i + 1).map((num) => (
            <span key={num} className={randomNumber === num ? 'highlight' : ''}>
              {num}
            </span>
          ))}
          {maxNumber && maxNumber > 10 && <span className="highlight">{randomNumber}</span>}
        </div>
      </div>
    </>
  );
}

export default App;
