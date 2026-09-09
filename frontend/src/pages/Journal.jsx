import { useEffect, useState } from "react";
import api from "../api/axios.js";

const TABS = [
  { key: "journal", label: "Journal", prompt: "What's one thing that happened today that you want to remember?" },
  { key: "gratitude", label: "Gratitude", prompt: "Name three things, big or small, that you're grateful for right now." },
  { key: "reframe", label: "Reframe a thought", prompt: "" },
];

const DISTORTIONS = [
  "All-or-nothing thinking",
  "Catastrophizing",
  "Mind reading",
  "Overgeneralizing",
  "Should statements",
  "Emotional reasoning",
];

export default function Journal() {
  const [tab, setTab] = useState("journal");
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState([]);

  // reframe-specific state
  const [negativeThought, setNegativeThought] = useState("");
  const [distortion, setDistortion] = useState(DISTORTIONS[0]);
  const [reframedThought, setReframedThought] = useState("");

  const load = (type) => api.get(`/journal?type=${type}`).then((res) => setEntries(res.data));

  useEffect(() => {
    load(tab);
  }, [tab]);

  const submit = async () => {
    if (tab === "reframe") {
      if (!negativeThought || !reframedThought) return;
      await api.post("/journal", {
        type: "reframe",
        content: reframedThought,
        negativeThought,
        distortion,
        reframedThought,
      });
      setNegativeThought("");
      setReframedThought("");
    } else {
      if (!content.trim()) return;
      await api.post("/journal", { type: tab, content });
      setContent("");
    }
    load(tab);
  };

  const activeTab = TABS.find((t) => t.key === tab);

  return (
    <main className="max-w-3xl mx-auto px-5 py-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl text-pine dark:text-mist">Your notebook</h1>
        <p className="text-ink/60 dark:text-mist/60 mt-1">A private space, just for your thoughts.</p>
      </div>

      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              tab === t.key ? "bg-pine text-cloud" : "border border-sage/30 text-ink/60 dark:text-mist/60 hover:bg-sage/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-cloud dark:bg-pine2 rounded-xl2 p-6 shadow-sm space-y-4">
        {tab !== "reframe" ? (
          <>
            <p className="text-sm text-sage font-medium">{activeTab.prompt}</p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder="Start writing…"
              className="w-full rounded-lg border border-sage/30 px-3 py-2 focus:outline-none bg-transparent"
            />
          </>
        ) : (
          <>
            <div>
              <label className="text-sm text-ink/60 dark:text-mist/60">What's the negative thought?</label>
              <textarea
                value={negativeThought}
                onChange={(e) => setNegativeThought(e.target.value)}
                rows={2}
                placeholder="e.g. I'm going to fail this presentation and everyone will notice."
                className="mt-1 w-full rounded-lg border border-sage/30 px-3 py-2 focus:outline-none bg-transparent"
              />
            </div>
            <div>
              <label className="text-sm text-ink/60 dark:text-mist/60">
                Does it match a common thinking pattern?
              </label>
              <select
                value={distortion}
                onChange={(e) => setDistortion(e.target.value)}
                className="mt-1 w-full rounded-lg border border-sage/30 px-3 py-2 bg-transparent"
              >
                {DISTORTIONS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-ink/60 dark:text-mist/60">
                Now try a more balanced version of that thought
              </label>
              <textarea
                value={reframedThought}
                onChange={(e) => setReframedThought(e.target.value)}
                rows={2}
                placeholder="e.g. I've prepared well. It's okay if it's not perfect — one presentation won't define me."
                className="mt-1 w-full rounded-lg border border-sage/30 px-3 py-2 focus:outline-none bg-transparent"
              />
            </div>
          </>
        )}

        <button
          onClick={submit}
          className="bg-pine text-cloud rounded-lg px-5 py-2 font-medium hover:bg-pine2 transition-colors"
        >
          Save entry
        </button>
      </div>

      <div className="space-y-3">
        {entries.map((e) => (
          <div key={e._id} className="bg-cloud dark:bg-pine2 rounded-xl2 p-4 shadow-sm">
            <p className="text-xs text-ink/40 dark:text-mist/40">
              {new Date(e.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
            </p>
            {e.type === "reframe" ? (
              <div className="mt-1 space-y-1 text-sm">
                <p className="text-ink/50 dark:text-mist/50 line-through">{e.negativeThought}</p>
                <p className="text-xs text-bloom">{e.distortion}</p>
                <p className="text-ink dark:text-mist">{e.reframedThought}</p>
              </div>
            ) : (
              <p className="mt-1 text-ink dark:text-mist text-sm whitespace-pre-wrap">{e.content}</p>
            )}
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-sm text-ink/40 dark:text-mist/40">No entries yet — your first one starts here.</p>
        )}
      </div>
    </main>
  );
}
