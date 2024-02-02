import { useState } from 'react';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [numRandoms, setNumRandoms] = useState(1);
  const [maxNumber, setMaxNumber] = useState(null);
  const [randomNumbers, setRandomNumbers] = useState([]);
  const [shuffling, setShuffling] = useState(false);
  const [ignoredNumbers, setIgnoredNumbers] = useState([]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const handleNumberSelectAndGenerate = (num) => {
    if (shuffling || num < numRandoms) return;
    setMaxNumber(num);
    setShuffling(true);
    let count = 0;
    const intervalId = setInterval(() => {
      const possibleNumbers = Array.from({ length: num }, (_, i) => i + 1).filter(n => !ignoredNumbers.includes(n));
      shuffleArray(possibleNumbers);
      setRandomNumbers(possibleNumbers.slice(0, numRandoms));
      count += 1;
      if (count > 6) {
        clearInterval(intervalId);
        setShuffling(false);
      }
    }, 75);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleNumRandomsChange = (e) => {
    setNumRandoms(Math.max(1, parseInt(e.target.value, 10) || 1));
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
        <div className="numbers">
          Numbers to generate:
          <input
            className='small-input'
            type="number"
            onChange={handleNumRandomsChange}
            placeholder="1"
            min="1"
            disabled={shuffling}
          />
        </div>
        <p>Select a number between 1 and :</p>
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
        <div className="numbers">
          {/* Numbers to ignore:
          <input
            className='small-input'
            type="text"
            value={ignoredNumbers.join(',')}
            onChange={e => setIgnoredNumbers(e.target.value.split(',').map(num => parseInt(num, 10)).filter(num => !isNaN(num)))}
            placeholder="0"
            disabled={shuffling}
          /> */ }
        </div> 
        <p>Or select a number in the field below</p>
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
          {maxNumber && maxNumber <= 100 && Array.from({ length: maxNumber }, (_, i) => i + 1).map((num) => (
            <span key={num} className={randomNumbers.includes(num) ? 'highlight' : ''}>
              {num}
            </span>
          ))}
          {maxNumber && maxNumber > 100 && randomNumbers.map((num, index) => (
            <span key={index} className="highlight">{num}</span>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;