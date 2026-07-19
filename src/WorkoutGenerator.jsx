import { useEffect, useState } from "react";

const storageKey = "workoutGeneratorState";

const upperBody = [
  "Axelpress",
  "Axellyft",
  "Bicepscurl",
  "Armhävningar",
  "Dips",
  "Golvpress",
  "Plankan",
];

const lowerBody = [
  "Knäböj",
  "Kissande hunden",
  "Tåhävningar",
  "Utfall",
  "Fällkniven",
  "Marklyft",
  "Rygglyft",
];

function shuffle(list) {
  const shuffled = [...list];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[i],
    ];
  }

  return shuffled;
}

function createEmptyRound() {
  return {
    upperRemaining: shuffle(upperBody),
    lowerRemaining: shuffle(lowerBody),
    currentWorkout: null,
    completedWorkouts: [],
    roundComplete: false,
  };
}

function drawWorkout(state) {
  const round =
    state.roundComplete ||
    state.upperRemaining.length === 0 ||
    state.lowerRemaining.length === 0
      ? createEmptyRound()
      : state;

  const upperRemaining = round.upperRemaining.slice(0, -1);
  const lowerRemaining = round.lowerRemaining.slice(0, -1);
  const workout = {
    upper: round.upperRemaining[round.upperRemaining.length - 1],
    lower: round.lowerRemaining[round.lowerRemaining.length - 1],
  };

  return {
    upperRemaining,
    lowerRemaining,
    currentWorkout: workout,
    completedWorkouts: [...round.completedWorkouts, workout],
    roundComplete: upperRemaining.length === 0 || lowerRemaining.length === 0,
  };
}

function isValidStoredState(state) {
  return (
    state &&
    Array.isArray(state.upperRemaining) &&
    Array.isArray(state.lowerRemaining) &&
    Array.isArray(state.completedWorkouts) &&
    typeof state.roundComplete === "boolean"
  );
}

function loadInitialState() {
  try {
    const storedState = localStorage.getItem(storageKey);
    const parsedState = storedState ? JSON.parse(storedState) : null;

    if (isValidStoredState(parsedState)) {
      return parsedState;
    }
  } catch {
    localStorage.removeItem(storageKey);
  }

  return drawWorkout(createEmptyRound());
}

function WorkoutGenerator() {
  const [workoutState, setWorkoutState] = useState(loadInitialState);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(workoutState));
  }, [workoutState]);

  const generateWorkout = () => {
    setWorkoutState((currentState) => drawWorkout(currentState));
  };

  const currentWorkout = workoutState.currentWorkout;
  const completedCount = workoutState.completedWorkouts.length;
  const totalCount = Math.min(upperBody.length, lowerBody.length);

  return (
    <section className="workout-generator card" aria-labelledby="workout-title">
      <h1 id="workout-title">🏋️ Träningsgenerator</h1>

      <button className="submit-button workout-button" onClick={generateWorkout}>
        {workoutState.roundComplete ? "Starta ny runda" : "Slumpa träningspass"}
      </button>

      <div className="workout-pass">
        <h2>Ditt pass</h2>

        <p>
          <strong>Överkropp:</strong>
          <span>{currentWorkout?.upper}</span>
        </p>

        <p>
          <strong>Underkropp:</strong>
          <span>{currentWorkout?.lower}</span>
        </p>
      </div>

      <div className="workout-history">
        <h2>Gjorda pass</h2>
        <p>
          {completedCount} av {totalCount}
        </p>

        <ol>
          {workoutState.completedWorkouts.map((workout, index) => (
            <li key={`${workout.upper}-${workout.lower}-${index}`}>
              <span>{index + 1}</span>
              <div>
                <strong>{workout.upper}</strong>
                <em>{workout.lower}</em>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default WorkoutGenerator;
