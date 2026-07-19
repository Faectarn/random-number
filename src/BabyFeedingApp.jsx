import { useMemo, useState } from "react";
import "./App.css";

const STORAGE_KEY = "babyFeedings";

const formatLocalDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatLocalTime = (date = new Date()) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const foodLabels = {
  breastmilk: "Bröstmjölk",
  formula: "Ersättning",
};

const quickAmounts = [60, 90, 120, 150];

const loadFeedings = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

function BabyFeedingApp() {
  const today = formatLocalDate();
  const currentTime = formatLocalTime();
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState(currentTime);
  const [foodType, setFoodType] = useState("breastmilk");
  const [amount, setAmount] = useState("");
  const [feedings, setFeedings] = useState(loadFeedings);

  const saveFeedings = (nextFeedings) => {
    setFeedings(nextFeedings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFeedings));
  };

  const getTotals = (items) =>
    items.reduce(
      (sum, feeding) => ({
        total: sum.total + feeding.amount,
        breastmilk:
          sum.breastmilk +
          (feeding.foodType === "breastmilk" ? feeding.amount : 0),
        formula:
          sum.formula + (feeding.foodType === "formula" ? feeding.amount : 0),
      }),
      { total: 0, breastmilk: 0, formula: 0 }
    );

  const dayCards = useMemo(() => {
    const groupedFeedings = feedings.reduce((groups, feeding) => {
      const date = feeding.date || today;
      return {
        ...groups,
        [date]: [...(groups[date] || []), feeding],
      };
    }, {});

    if (!groupedFeedings[selectedDate]) {
      groupedFeedings[selectedDate] = [];
    }

    return Object.entries(groupedFeedings)
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
      .map(([date, items]) => {
        const sortedItems = [...items].sort((a, b) => {
          if (a.time && b.time && a.time !== b.time) {
            return b.time.localeCompare(a.time);
          }

          return b.createdAt - a.createdAt;
        });

        return {
          date,
          feedings: sortedItems,
          totals: getTotals(sortedItems),
        };
      });
  }, [feedings, selectedDate, today]);

  const selectedDayTotals = useMemo(
    () =>
      getTotals(
        feedings.filter((feeding) => feeding.date === selectedDate)
        .sort((a, b) => {
          if (a.time && b.time && a.time !== b.time) {
            return b.time.localeCompare(a.time);
          }

          return b.createdAt - a.createdAt;
        })
      ),
    [feedings, selectedDate]
  );

  const addFeeding = (event) => {
    event.preventDefault();
    const parsedAmount = Number(amount);

    if (!selectedDate || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    saveFeedings([
      {
        id: crypto.randomUUID(),
        date: selectedDate,
        time: selectedTime,
        foodType,
        amount: Math.round(parsedAmount),
        createdAt: Date.now(),
      },
      ...feedings,
    ]);
    setAmount("");
  };

  const removeFeeding = (id) => {
    saveFeedings(feedings.filter((feeding) => feeding.id !== id));
  };

  return (
    <main className="card baby-feeding">
      <header className="feeding-header">
        <div>
          <h2>Beibsmatning</h2>
          <p>{selectedDate} är vald för ny matning</p>
        </div>
        <div className="feeding-header-total" aria-live="polite">
          <span>Dagens total</span>
          <strong>{selectedDayTotals.total} ml</strong>
        </div>
      </header>

      <form className="feeding-form" onSubmit={addFeeding}>
        <label>
          Datum
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
        </label>

        <label>
          Klockslag
          <input
            type="time"
            value={selectedTime}
            onChange={(event) => setSelectedTime(event.target.value)}
          />
        </label>

        <label>
          Typ av mat
          <select
            value={foodType}
            onChange={(event) => setFoodType(event.target.value)}
          >
            <option value="breastmilk">Bröstmjölk</option>
            <option value="formula">Ersättning</option>
          </select>
        </label>

        <label>
          Mängd ml
          <input
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            placeholder="90"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>

        <div className="feeding-actions">
          <div className="quick-amounts" aria-label="Snabbval för mängd">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                className={amount === String(quickAmount) ? "active" : ""}
                onClick={() => setAmount(String(quickAmount))}
              >
                {quickAmount}
              </button>
            ))}
          </div>

          <button className="submit-button feeding-submit" type="submit">
            Lägg till
          </button>
        </div>
      </form>

      <section className="feeding-days" aria-label="Matningar per dag">
        {dayCards.map((day) => (
          <article
            className={`feeding-day-card ${
              day.date === selectedDate ? "selected-day" : ""
            }`}
            key={day.date}
          >
            <button
              type="button"
              className="feeding-day-header"
              onClick={() => setSelectedDate(day.date)}
            >
              <span>{day.date === today ? "Idag" : day.date}</span>
              <strong>{day.totals.total} ml</strong>
            </button>

            <div className="feeding-day-meta">
              <span>Bröstmjölk {day.totals.breastmilk} ml</span>
              <span>Ersättning {day.totals.formula} ml</span>
              <span>{day.feedings.length} matningar</span>
            </div>

            <div className="feeding-list">
              {day.feedings.length === 0 ? (
                <p>Ingen matning loggad för den här dagen.</p>
              ) : (
                day.feedings.map((feeding) => (
                  <div className="feeding-row" key={feeding.id}>
                    <time>{feeding.time || "--:--"}</time>
                    <div>
                      <strong>{feeding.amount} ml</strong>
                      <span>{foodLabels[feeding.foodType]}</span>
                    </div>
                    <button
                      type="button"
                      className="remove-feeding-button"
                      onClick={() => removeFeeding(feeding.id)}
                      aria-label={`Ta bort ${feeding.amount} ml ${
                        foodLabels[feeding.foodType]
                      }`}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default BabyFeedingApp;
