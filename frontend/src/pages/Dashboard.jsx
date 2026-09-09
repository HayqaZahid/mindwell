import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const QUOTES = [
  "You don't have to see the whole staircase, just take the first step.",
  "Feelings are visitors. Let them come and go.",
  "Small steps still move you forward.",
  "It's okay to rest. Resting is not quitting.",
  "You are not your thoughts. You are the one who notices them.",
  "Progress, not perfection.",
];

const quickLinks = [
  { to: "/mood", label: "Log today's mood", desc: "30 seconds, one tap" },
  { to: "/breathing", label: "Breathe for a minute", desc: "Box or 4-7-8 breathing" },
  { to: "/journal", label: "Write 3 gratitudes", desc: "Shift your focus" },
  { to: "/chatbot", label: "Talk it through", desc: "A supportive listening ear" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [streak, setStreak] = useState(null);
  const [trend, setTrend] = useState([]);
  const quote = QUOTES[new Date().getDate() % QUOTES.length];

  useEffect(() => {
    api.post("/auth/checkin").then((res) => setStreak(res.data));
    api.get("/mood/trend?days=14").then((res) =>
      setTrend(res.data.map((m) => ({ date: new Date(m.date).toLocaleDateString(undefined, { weekday: "short" }), score: m.score })))
    );
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-5 py-8 space-y-8">
      <section>
        <h1 className="font-display text-3xl text-pine dark:text-mist">
          Hi {user?.name?.split(" ")[0] || "there"}.
        </h1>
        <p className="text-ink/60 dark:text-mist/60 italic font-display mt-1">"{quote}"</p>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        <div className="bg-cloud dark:bg-pine2 rounded-xl2 p-5 shadow-sm">
          <p className="text-sm text-ink/50 dark:text-mist/50">Current streak</p>
          <p className="font-display text-4xl text-amber mt-1">{streak?.currentStreak ?? "–"}</p>
          <p className="text-xs text-ink/40 dark:text-mist/40 mt-1">days checking in</p>
        </div>
        <div className="bg-cloud dark:bg-pine2 rounded-xl2 p-5 shadow-sm">
          <p className="text-sm text-ink/50 dark:text-mist/50">Longest streak</p>
          <p className="font-display text-4xl text-pine dark:text-mist mt-1">{streak?.longestStreak ?? "–"}</p>
          <p className="text-xs text-ink/40 dark:text-mist/40 mt-1">your personal best</p>
        </div>
        <div className="bg-cloud dark:bg-pine2 rounded-xl2 p-5 shadow-sm">
          <p className="text-sm text-ink/50 dark:text-mist/50">Mood entries logged</p>
          <p className="font-display text-4xl text-bloom mt-1">{trend.length}</p>
          <p className="text-xs text-ink/40 dark:text-mist/40 mt-1">in the last 14 days</p>
        </div>
      </section>

      <section className="bg-cloud dark:bg-pine2 rounded-xl2 p-5 shadow-sm">
        <h2 className="font-display text-lg text-pine dark:text-mist mb-3">Your last 14 days</h2>
        {trend.length > 1 ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trend}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#7C9885" />
              <YAxis domain={[1, 5]} tick={{ fontSize: 12 }} stroke="#7C9885" />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#C97B84" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-ink/50 dark:text-mist/50">
            Log a couple of mood entries to see your trend here.
          </p>
        )}
      </section>

      <section>
        <h2 className="font-display text-lg text-pine dark:text-mist mb-3">Quick actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className="bg-cloud dark:bg-pine2 rounded-xl2 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <p className="font-medium text-ink dark:text-mist">{q.label}</p>
              <p className="text-sm text-ink/50 dark:text-mist/50 mt-1">{q.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
