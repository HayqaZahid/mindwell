import { useEffect, useRef, useState } from "react";

const PATTERNS = {
  box: { label: "Box breathing", steps: [["Inhale", 4], ["Hold", 4], ["Exhale", 4], ["Hold", 4]] },
  "4-7-8": { label: "4-7-8 breathing", steps: [["Inhale", 4], ["Hold", 7], ["Exhale", 8]] },
};

const GROUNDING_STEPS = [
  { count: 5, sense: "things you can see" },
  { count: 4, sense: "things you can touch" },
  { count: 3, sense: "things you can hear" },
  { count: 2, sense: "things you can smell" },
  { count: 1, sense: "thing you can taste" },
];

function BreathingExercise() {
  const [pattern, setPattern] = useState("box");
  const [running, setRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(PATTERNS.box.steps[0][1]);
  const timerRef = useRef(null);

  const steps = PATTERNS[pattern].steps;

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s > 1) return s - 1;
        setStepIndex((i) => {
          const next = (i + 1) % steps.length;
          setSecondsLeft(steps[next][1]);
          return next;
        });
        return steps[(stepIndex + 1) % steps.length][1];
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, pattern]);

  const start = (p) => {
    setPattern(p);
    setStepIndex(0);
    setSecondsLeft(PATTERNS[p].steps[0][1]);
    setRunning(true);
  };

  const stop = () => {
    setRunning(false);
    clearInterval(timerRef.current);
  };

  const currentLabel = steps[stepIndex][0];
  const scale = currentLabel === "Inhale" ? "scale-110" : currentLabel === "Exhale" ? "scale-75" : "scale-100";

  return (
    <div className="bg-cloud dark:bg-pine2 rounded-xl2 p-8 shadow-sm flex flex-col items-center gap-6">
      <div className="flex gap-2">
        {Object.entries(PATTERNS).map(([key, p]) => (
          <button
            key={key}
            onClick={() => start(key)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
              pattern === key && running ? "bg-pine text-cloud border-pine" : "border-sage/30 hover:bg-sage/10"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="relative w-56 h-56 flex items-center justify-center">
        <div
          className={`absolute inset-0 rounded-full bg-pine/15 transition-transform ease-in-out duration-1000 ${scale}`}
        />
        <div
          className={`absolute inset-6 rounded-full bg-bloom/20 transition-transform ease-in-out duration-1000 ${scale}`}
        />
        <div className="relative text-center">
          <p className="font-display text-2xl text-pine dark:text-mist">{running ? currentLabel : "Ready?"}</p>
          {running && <p className="text-4xl font-display text-bloom mt-1">{secondsLeft}</p>}
        </div>
      </div>

      {running ? (
        <button onClick={stop} className="text-sm text-bloom hover:underline">
          Stop
        </button>
      ) : (
        <button
          onClick={() => start(pattern)}
          className="bg-pine text-cloud rounded-lg px-6 py-2.5 font-medium hover:bg-pine2 transition-colors"
        >
          Start breathing
        </button>
      )}
    </div>
  );
}

function GroundingExercise() {
  const [step, setStep] = useState(0);
  const [items, setItems] = useState(Array(5).fill(""));
  const current = GROUNDING_STEPS[step];

  const updateItem = (i, val) => setItems((prev) => prev.map((it, idx) => (idx === i ? val : it)));

  return (
    <div className="bg-cloud dark:bg-pine2 rounded-xl2 p-6 shadow-sm space-y-4">
      <h2 className="font-display text-lg text-pine dark:text-mist">5-4-3-2-1 grounding</h2>
      {step < GROUNDING_STEPS.length ? (
        <>
          <p className="text-sm text-ink/60 dark:text-mist/60">
            Name {current.count} {current.sense}
          </p>
          <div className="space-y-2">
            {Array.from({ length: current.count }).map((_, i) => (
              <input
                key={i}
                value={items[i] || ""}
                onChange={(e) => updateItem(i, e.target.value)}
                placeholder={`${i + 1}.`}
                className="w-full rounded-lg border border-sage/30 px-3 py-1.5 bg-transparent text-sm"
              />
            ))}
          </div>
          <button
            onClick={() => {
              setStep((s) => s + 1);
              setItems(Array(5).fill(""));
            }}
            className="bg-pine text-cloud rounded-lg px-5 py-2 text-sm font-medium hover:bg-pine2 transition-colors"
          >
            Next
          </button>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-ink dark:text-mist">Nicely done. Notice how you feel right now.</p>
          <button
            onClick={() => setStep(0)}
            className="mt-3 text-sm text-bloom hover:underline"
          >
            Do it again
          </button>
        </div>
      )}
    </div>
  );
}

export default function Breathing() {
  return (
    <main className="max-w-2xl mx-auto px-5 py-8 space-y-8">
      <div>
        <h1 className="font-display text-2xl text-pine dark:text-mist">Slow down for a moment</h1>
        <p className="text-ink/60 dark:text-mist/60 mt-1">Pick whichever one your body needs right now.</p>
      </div>
      <BreathingExercise />
      <GroundingExercise />
    </main>
  );
}
