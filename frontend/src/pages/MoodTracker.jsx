import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../api/axios.js";

const MOODS = [
  { score: 1, emoji: "😞", label: "Very low" },
  { score: 2, emoji: "😕", label: "Low" },
  { score: 3, emoji: "😐", label: "Okay" },
  { score: 4, emoji: "🙂", label: "Good" },
  { score: 5, emoji: "😄", label: "Great" },
];

const TAGS = ["sleep", "work", "social", "exercise", "family", "health", "money", "weather"];

export default function MoodTracker() {
  const [score, setScore] = useState(null);
  const [note, setNote] = useState("");
  const [tags, setTags] = useState([]);
  const [entries, setEntries] = useState([]);
  const [saved, setSaved] = useState(false);

  const loadEntries = () => {
    api.get("/mood/trend?days=30").then((res) =>
      setEntries(
        res.data.map((m) => ({
          date: new Date(m.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          score: m.score,
        }))
      )
    );
  };

  useEffect(loadEntries, []);

  const toggleTag = (tag) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const submit = async () => {
    if (!score) return;
    await api.post("/mood", { score, note, tags });
    setScore(null);
    setNote("");
    setTags([]);
    setSaved(true);
    loadEntries();
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <main className="max-w-3xl mx-auto px-5 py-8 space-y-8">
      <div>
        <h1 className="font-display text-2xl text-pine dark:text-mist">How are you, really?</h1>
        <p className="text-ink/60 dark:text-mist/60 mt-1">There's no wrong answer. Just be honest with yourself.</p>
      </div>

      <div className="bg-cloud dark:bg-pine2 rounded-xl2 p-6 shadow-sm space-y-5">
        <div className="flex justify-between">
          {MOODS.map((m) => (
            <button
              key={m.score}
              onClick={() => setScore(m.score)}
              className={`flex flex-col items-center gap-1 rounded-xl2 px-3 py-2 transition-all ${
                score === m.score ? "bg-bloom/20 scale-110" : "hover:bg-sage/10"
              }`}
            >
              <span className="text-3xl">{m.emoji}</span>
              <span className="text-xs text-ink/60 dark:text-mist/60">{m.label}</span>
            </button>
          ))}
        </div>

        <div>
          <p className="text-sm text-ink/60 dark:text-mist/60 mb-2">What's influencing this? (optional)</p>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                  tags.includes(tag)
                    ? "bg-pine text-cloud border-pine"
                    : "border-sage/30 text-ink/60 dark:text-mist/60 hover:bg-sage/10"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Anything you want to note about today? (optional)"
          rows={3}
          className="w-full rounded-lg border border-sage/30 px-3 py-2 focus:outline-none bg-transparent"
        />

        <button
          onClick={submit}
          disabled={!score}
          className="w-full bg-pine text-cloud rounded-lg py-2.5 font-medium hover:bg-pine2 transition-colors disabled:opacity-40"
        >
          {saved ? "Saved ✓" : "Save today's check-in"}
        </button>
      </div>

      <div className="bg-cloud dark:bg-pine2 rounded-xl2 p-6 shadow-sm">
        <h2 className="font-display text-lg text-pine dark:text-mist mb-3">Last 30 days</h2>
        {entries.length > 1 ? (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={entries}>
              <CartesianGrid stroke="#7C988533" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#7C9885" />
              <YAxis domain={[1, 5]} tick={{ fontSize: 11 }} stroke="#7C9885" />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#1F4E4A" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-ink/50 dark:text-mist/50">Log a few days to see your pattern emerge.</p>
        )}
      </div>
    </main>
  );
}
