import React, { useState } from "react";

const DateEstimator = () => {
  const [date1, setDate1] = useState("");
  const [amount1, setAmount1] = useState("");
  const [date2, setDate2] = useState("");
  const [amount2, setAmount2] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [estimatedDate, setEstimatedDate] = useState(null);

  const calculateDate = () => {
    if (!date1 || !amount1 || !date2 || !amount2 || !targetAmount) {
      alert("Fyll i alla fält!");
      return;
    }

    // Omvandla datum till tidsstämplar
    const time1 = new Date(date1).getTime();
    const time2 = new Date(date2).getTime();
    const parsedAmount1 = parseFloat(amount1);
    const parsedAmount2 = parseFloat(amount2);
    const parsedTarget = parseFloat(targetAmount);

    if (time1 === time2 || parsedAmount1 === parsedAmount2) {
      alert("Datumen eller befolkningstalen får inte vara samma!");
      return;
    }

    // Beräkna linjär ökning per dag
    const growthRate = (time2 - time1) / (parsedAmount2 - parsedAmount1);

    // Beräkna datum för mål-befolkningen
    const estimatedTime = time1 + (parsedTarget - parsedAmount1) * growthRate;
    const estimatedDateObj = new Date(estimatedTime);

    // Konvertera till YYYY-MM-DD format
    const formattedDate = estimatedDateObj.toISOString().split("T")[0];
    setEstimatedDate(formattedDate);
    console.log(formattedDate)
  };

  return (
    <div className="card">
      <div className="time-input-div">
        <input
          className="time-input"
          type="date"
          value={date1}
          onChange={(e) => setDate1(e.target.value)}
        />
        <br />
        <input
          className="rating-input"
          type="number"
          placeholder="Antal"
          value={amount1}
          onChange={(e) => setAmount1(e.target.value)}
        />
        <br />
      </div>
      <div className="time-input-div">
        <input
          className="time-input"
          type="date"
          value={date2}
          onChange={(e) => setDate2(e.target.value)}
        />
        <br />
        <input
          className="rating-input"
          type="number"
          placeholder="Antal"
          value={amount2}
          onChange={(e) => setAmount2(e.target.value)}
        />
        <br />
      </div>
      <div className="time-input-div">
        <input
          className="rating-input"
          type="number"
          placeholder="Antal"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
        />
        <br />
      </div>
      <button className="date-button" onClick={calculateDate}>Beräkna Datum</button>
      {estimatedDate && <h3>Uppskattat datum: {estimatedDate}</h3>}
    </div>
  );
};

export default DateEstimator;