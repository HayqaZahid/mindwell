import { useEffect, useState } from "react";
import api from "../api/axios.js";

const TOPICS = ["all", "general", "anxiety", "stress", "sleep", "wins"];

export default function Community() {
  const [topic, setTopic] = useState("all");
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [postTopic, setPostTopic] = useState("general");
  const [replyDrafts, setReplyDrafts] = useState({});

  const load = () => api.get(`/community?topic=${topic}`).then((res) => setPosts(res.data));

  useEffect(() => {
    load();
  }, [topic]);

  const submitPost = async () => {
    if (!content.trim()) return;
    await api.post("/community", { content, topic: postTopic });
    setContent("");
    load();
  };

  const support = async (id) => {
    await api.post(`/community/${id}/support`);
    load();
  };

  const reply = async (id) => {
    const draft = replyDrafts[id];
    if (!draft?.trim()) return;
    await api.post(`/community/${id}/reply`, { content: draft });
    setReplyDrafts((d) => ({ ...d, [id]: "" }));
    load();
  };

  return (
    <main className="max-w-2xl mx-auto px-5 py-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl text-pine dark:text-mist">Community</h1>
        <p className="text-ink/60 dark:text-mist/60 mt-1 text-sm">
          Posts here are anonymous. Be kind — everyone's carrying something.
        </p>
      </div>

      <div className="bg-cloud dark:bg-pine2 rounded-xl2 p-5 shadow-sm space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="Share what's on your mind, anonymously…"
          className="w-full rounded-lg border border-sage/30 px-3 py-2 focus:outline-none bg-transparent text-sm"
        />
        <div className="flex items-center justify-between">
          <select
            value={postTopic}
            onChange={(e) => setPostTopic(e.target.value)}
            className="rounded-lg border border-sage/30 px-2 py-1 text-sm bg-transparent"
          >
            {TOPICS.filter((t) => t !== "all").map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <button
            onClick={submitPost}
            className="bg-pine text-cloud rounded-full px-5 py-1.5 text-sm font-medium hover:bg-pine2 transition-colors"
          >
            Post anonymously
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {TOPICS.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap border transition-colors ${
              topic === t ? "bg-pine text-cloud border-pine" : "border-sage/30 hover:bg-sage/10"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {posts.map((p) => (
          <div key={p._id} className="bg-cloud dark:bg-pine2 rounded-xl2 p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs px-2 py-0.5 rounded-full bg-sage/15 text-sage">{p.topic}</span>
              <span className="text-xs text-ink/40 dark:text-mist/40">
                {new Date(p.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-ink dark:text-mist">{p.content}</p>
            <button
              onClick={() => support(p._id)}
              className="text-xs text-bloom hover:underline"
            >
              🤍 {p.supportCount} sending support
            </button>

            {p.replies?.length > 0 && (
              <div className="border-l-2 border-sage/20 pl-3 space-y-2">
                {p.replies.map((r) => (
                  <p key={r._id} className="text-xs text-ink/70 dark:text-mist/70">
                    {r.content}
                  </p>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                value={replyDrafts[p._id] || ""}
                onChange={(e) => setReplyDrafts((d) => ({ ...d, [p._id]: e.target.value }))}
                placeholder="Reply with support…"
                className="flex-1 rounded-full border border-sage/30 px-3 py-1 text-xs bg-transparent"
              />
              <button onClick={() => reply(p._id)} className="text-xs text-pine dark:text-mist font-medium">
                Reply
              </button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="text-sm text-ink/40 dark:text-mist/40">No posts yet in this topic.</p>}
      </div>
    </main>
  );
}
