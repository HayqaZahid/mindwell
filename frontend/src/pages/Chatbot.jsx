import { useEffect, useRef, useState } from "react";
import api from "../api/axios.js";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi, I'm here to listen. What's on your mind today?" },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || busy) return;
    const next = [...messages, { role: "user", content: input }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await api.post("/chatbot", { messages: next });
      setMessages([...next, { role: "assistant", content: res.data.reply }]);
    } catch (err) {
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. If you need support urgently, please reach out to a crisis line or someone you trust.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-5 py-8 flex flex-col h-[calc(100vh-90px)]">
      <div>
        <h1 className="font-display text-2xl text-pine dark:text-mist">Talk it through</h1>
        <p className="text-ink/60 dark:text-mist/60 mt-1 text-sm">
          A supportive listening space. Not a therapist, not a diagnosis — just here to listen.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-xl2 px-4 py-2.5 text-sm ${
                m.role === "user" ? "bg-pine text-cloud" : "bg-cloud dark:bg-pine2 text-ink dark:text-mist shadow-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {busy && <p className="text-xs text-ink/40 dark:text-mist/40 pl-1">Mindwell is typing…</p>}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type how you're feeling…"
          className="flex-1 rounded-full border border-sage/30 px-4 py-2.5 focus:outline-none bg-transparent"
        />
        <button
          onClick={send}
          disabled={busy}
          className="bg-pine text-cloud rounded-full px-5 font-medium hover:bg-pine2 transition-colors disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </main>
  );
}
