import { useEffect, useMemo, useRef, useState } from "react";

const palette = [
  "#e85d75",
  "#2f9c95",
  "#f2b84b",
  "#6c72d9",
  "#d96c3b",
  "#3f8fc5",
  "#78a85a",
  "#c45fa3",
];

const spinDurationMs = 4200;

function LuckyWheel() {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);
  const [pickedItems, setPickedItems] = useState([]);
  const [result, setResult] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [nextId, setNextId] = useState(1);
  const spinTimeoutRef = useRef(null);

  const wheelBackground = useMemo(() => {
    if (items.length === 0) {
      return "radial-gradient(circle, #333 0 42%, #242424 43% 100%)";
    }

    const sliceSize = 360 / items.length;
    const segments = items.map((_, index) => {
      const start = index * sliceSize;
      const end = start + sliceSize;
      return `${palette[index % palette.length]} ${start}deg ${end}deg`;
    });

    return `conic-gradient(from -90deg, ${segments.join(", ")})`;
  }, [items]);

  const addItem = () => {
    const label = inputValue.trim();
    if (!label) return;

    setItems((currentItems) => [...currentItems, { id: nextId, label }]);
    setNextId((currentId) => currentId + 1);
    setInputValue("");
  };

  const removeItem = (id) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const resetPickedItems = () => {
    setItems((currentItems) => [...currentItems, ...pickedItems]);
    setPickedItems([]);
    setResult("");
  };

  const spinWheel = () => {
    if (isSpinning || items.length === 0) return;

    const winner = items[Math.floor(Math.random() * items.length)];
    const sliceSize = 360 / items.length;
    const winnerIndex = items.findIndex((item) => item.id === winner.id);
    const winnerCenter = winnerIndex * sliceSize + sliceSize / 2;
    const pointerOffset = 360 - winnerCenter;
    const extraTurns = 5 * 360;

    setIsSpinning(true);
    setResult("");
    setRotation((currentRotation) => {
      const normalizedRotation = currentRotation % 360;
      return currentRotation + extraTurns + pointerOffset - normalizedRotation;
    });

    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
    }

    spinTimeoutRef.current = setTimeout(() => {
      setItems((currentItems) =>
        currentItems.filter((item) => item.id !== winner.id)
      );
      setPickedItems((currentPickedItems) => [...currentPickedItems, winner]);
      setResult(winner.label);
      setIsSpinning(false);
    }, spinDurationMs);
  };

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
      }
    };
  }, []);

  const statusText = result
    ? `Vald: ${result}`
    : items.length === 0 && pickedItems.length > 0
    ? "Alla alternativ är använda."
    : "Lägg till alternativ och snurra hjulet.";

  return (
    <section className="lucky-wheel card" aria-labelledby="lucky-wheel-title">
      <div className="lucky-wheel-header">
        <h3 id="lucky-wheel-title">Lyckohjul</h3>
        <span>{items.length} kvar</span>
      </div>

      <div className="lucky-wheel-controls">
        <input
          className="lucky-wheel-input"
          type="text"
          placeholder="Lägg till person/sak"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") addItem();
          }}
          disabled={isSpinning}
        />
        <button className="submit-button" onClick={addItem} disabled={isSpinning}>
          Lägg till
        </button>
        <button
          className="submit-button"
          onClick={spinWheel}
          disabled={isSpinning || items.length === 0}
        >
          {isSpinning ? "Snurrar..." : "Snurra"}
        </button>
        <button
          className="submit-button reset-wheel-button"
          onClick={resetPickedItems}
          disabled={isSpinning || pickedItems.length === 0}
        >
          Återställ
        </button>
      </div>

      <div className="wheel-shell">
        <div className="wheel-pointer" />
        <div
          className={`wheel ${isSpinning ? "is-spinning" : ""}`}
          style={{
            background: wheelBackground,
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <div className="wheel-center" />
          {items.map((item, index) => {
            const sliceSize = 360 / items.length;
            const angle = index * sliceSize + sliceSize / 2;

            return (
              <span
                key={item.id}
                className="wheel-label"
                style={{ "--angle": `${angle}deg` }}
                title={item.label}
              >
                {item.label}
              </span>
            );
          })}
        </div>
      </div>

      <p className="wheel-result" aria-live="polite">
        {statusText}
      </p>

      {pickedItems.length > 0 && (
        <div className="picked-wheel-items">
          <h4>Valda i ordning</h4>
          <ol>
            {pickedItems.map((item) => (
              <li key={item.id}>{item.label}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="lucky-wheel-items">
        {items.map((item) => (
          <div key={item.id} className="lucky-wheel-item">
            <span>{item.label}</span>
            <button
              className="remove-item-button"
              onClick={() => removeItem(item.id)}
              disabled={isSpinning}
              aria-label={`Ta bort ${item.label}`}
              title={`Ta bort ${item.label}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LuckyWheel;
