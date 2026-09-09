import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../api/axios.js";

export default function Habits() {
  const [water, setWater] = useState(0);
  const [exercise, setExercise] = useState(0);
  const [meditation, setMeditation] = useState(0);
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [history, setHistory] = useState([]);
  const [saved, setSaved] = useState(false);

  const load = () =>
    api.get("/habit?days=14").then((res) =>
      setHistory(
        res.data.map((h) => ({
          date: new Date(h.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          sleepHours: h.sleepHours,
          water: h.waterGlasses,
        }))
      )
    );

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    await api.post("/habit", {
      waterGlasses: water,
      exerciseMinutes: exercise,
      meditationMinutes: meditation,
      sleepHours,
      sleepQuality,
    });
    setSaved(true);
    load();
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <main className="max-w-3xl mx-auto px-5 py-8 space-y-8">
      <div>
        <h1 className="font-display text-2xl text-pine dark:text-mist">Daily habits</h1>
        <p className="text-ink/60 dark:text-mist/60 mt-1">Small, steady things add up.</p>
      </div>

      <div className="bg-cloud dark:bg-pine2 rounded-xl2 p-6 shadow-sm space-y-6">
        <div>
          <label className="text-sm text-ink/60 dark:text-mist/60">Water — {water} glasses</label>
          <input
            type="range"
            min="0"
            max="12"
            value={water}
            onChange={(e) => setWater(+e.target.value)}
            className="w-full accent-pine"
          />
        </div>
        <div>
          <label className="text-sm text-ink/60 dark:text-mist/60">Exercise — {exercise} minutes</label>
          <input
            type="range"
            min="0"
            max="120"
            step="5"
            value={exercise}
            onChange={(e) => setExercise(+e.target.value)}
            className="w-full accent-pine"
          />
        </div>
        <div>
          <label className="text-sm text-ink/60 dark:text-mist/60">Meditation — {meditation} minutes</label>
          <input
            type="range"
            min="0"
            max="60"
            step="5"
            value={meditation}
            onChange={(e) => setMeditation(+e.target.value)}
            className="w-full accent-pine"
          />
        </div>
        <div>
          <label className="text-sm text-ink/60 dark:text-mist/60">Sleep — {sleepHours} hours</label>
          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={sleepHours}
            onChange={(e) => setSleepHours(+e.target.value)}
            className="w-full accent-pine"
          />
        </div>
        <div>
          <p className="text-sm text-ink/60 dark:text-mist/60 mb-1">Sleep quality</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((q) => (
              <button
                key={q}
                onClick={() => setSleepQuality(q)}
                className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${
                  sleepQuality === q ? "bg-pine text-cloud border-pine" : "border-sage/30 hover:bg-sage/10"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={submit}
          className="w-full bg-pine text-cloud rounded-lg py-2.5 font-medium hover:bg-pine2 transition-colors"
        >
          {saved ? "Saved ✓" : "Save today"}
        </button>
      </div>

      <div className="bg-cloud dark:bg-pine2 rounded-xl2 p-6 shadow-sm">
        <h2 className="font-display text-lg text-pine dark:text-mist mb-3">Sleep, last 14 days</h2>
        {history.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={history}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#7C9885" />
              <YAxis tick={{ fontSize: 11 }} stroke="#7C9885" />
              <Tooltip />
              <Bar dataKey="sleepHours" fill="#1F4E4A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-ink/50 dark:text-mist/50">Log a few days to see your pattern.</p>
        )}
      </div>
    </main>
  );
}
