import React, { useState } from "react";

const PopulationDateEstimator = () => {
  const [date1, setDate1] = useState("");
  const [population1, setPopulation1] = useState("");
  const [date2, setDate2] = useState("");
  const [population2, setPopulation2] = useState("");
  const [targetPopulation, setTargetPopulation] = useState("");
  const [estimatedDate, setEstimatedDate] = useState(null);

  const calculateDate = () => {
    if (!date1 || !population1 || !date2 || !population2 || !targetPopulation) {
      alert("Fyll i alla fält!");
      return;
    }

    // Omvandla datum till tidsstämplar
    const time1 = new Date(date1).getTime();
    const time2 = new Date(date2).getTime();
    const pop1 = parseFloat(population1);
    const pop2 = parseFloat(population2);
    const targetPop = parseFloat(targetPopulation);

    if (time1 === time2 || pop1 === pop2) {
      alert("Datumen eller befolkningstalen får inte vara samma!");
      return;
    }

    // Beräkna linjär ökning per dag
    const growthRate = (time2 - time1) / (pop2 - pop1);

    // Beräkna datum för mål-befolkningen
    const estimatedTime = time1 + (targetPop - pop1) * growthRate;
    const estimatedDateObj = new Date(estimatedTime);

    // Konvertera till YYYY-MM-DD format
    const formattedDate = estimatedDateObj.toISOString().split("T")[0];
    setEstimatedDate(formattedDate);
  };

  return (
    <div className="card">
      {/* <h2>Datumestimator</h2> */}

      {/* <label>Datum 1: </label> */}
      <div className="time-input-div">
        <input
          class="time-input"
          type="date"
          value={date1}
          onChange={(e) => setDate1(e.target.value)}
        />
        <br />
      

      
        {/* <label>Ratings </label> */}
        <input
          class="rating-input"
          type="number"
          placeholder="Antal"
          value={population1}
          onChange={(e) => setPopulation1(e.target.value)}
        />
        <br />
        </div>
      

      <div className="time-input-div">
        {/* <label>Datum 2: </label> */}
        <input
          class="time-input"
          type="date"
          value={date2}
          onChange={(e) => setDate2(e.target.value)}
        />
        <br />
      
      
        {/* <label>Ratings </label> */}
        <input
          class="rating-input"
          type="number"
          placeholder="Antal"
          value={population2}
          onChange={(e) => setPopulation2(e.target.value)}
        />
        <br />
        
      </div>
      <div className="time-input-div">
        {/* <label>Ratings:</label> */}
        <input
          class="rating-input"
          type="number"
          placeholder="Antal"
          value={targetPopulation}
          onChange={(e) => setTargetPopulation(e.target.value)}
        />
        <br />
      </div>
      <button className="date-button" onClick={calculateDate}>Beräkna Datum</button>

      {estimatedDate && <h3>Uppskattat datum: {estimatedDate}</h3>}
      </div>
  );
};

export default PopulationDateEstimator;