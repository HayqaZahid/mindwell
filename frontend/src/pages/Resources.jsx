const ARTICLES = [
  { title: "Understanding anxiety: what's actually happening in your body", topic: "Anxiety" },
  { title: "Why stress isn't always the enemy", topic: "Stress" },
  { title: "Sleep hygiene basics that actually work", topic: "Sleep" },
  { title: "Grounding techniques for panic moments", topic: "Anxiety" },
  { title: "How to support a friend who's struggling", topic: "Relationships" },
  { title: "The difference between sadness and depression", topic: "Mood" },
];

const HOTLINES = [
  { region: "United States", name: "988 Suicide & Crisis Lifeline", contact: "Call or text 988" },
  { region: "United Kingdom", name: "Samaritans", contact: "Call 116 123" },
  { region: "Pakistan", name: "Umang Mental Health Helpline (24/7)", contact: "Call 0311-7786264" },
  { region: "International", name: "Find a helpline near you", contact: "findahelpline.com" },
];

export default function Resources() {
  return (
    <main className="max-w-3xl mx-auto px-5 py-8 space-y-8">
      <div>
        <h1 className="font-display text-2xl text-pine dark:text-mist">Resources</h1>
        <p className="text-ink/60 dark:text-mist/60 mt-1">Things to read, and people to call if you need to.</p>
      </div>

      <section className="bg-bloom/10 border border-bloom/30 rounded-xl2 p-5">
        <h2 className="font-display text-lg text-bloom mb-3">If you're in crisis right now</h2>
        <div className="space-y-2">
          {HOTLINES.map((h) => (
            <div key={h.name} className="flex justify-between text-sm">
              <span className="text-ink dark:text-mist">
                {h.name} <span className="text-ink/40 dark:text-mist/40">— {h.region}</span>
              </span>
              <span className="text-bloom font-medium">{h.contact}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink/50 dark:text-mist/50 mt-3">
          This app is not a replacement for professional care. If you or someone you know is in danger, please
          contact local emergency services.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-pine dark:text-mist mb-3">Articles</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {ARTICLES.map((a) => (
            <div key={a.title} className="bg-cloud dark:bg-pine2 rounded-xl2 p-4 shadow-sm">
              <span className="text-xs text-sage">{a.topic}</span>
              <p className="text-sm text-ink dark:text-mist mt-1">{a.title}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink/40 dark:text-mist/40 mt-3">
          Wire these up to real articles or a CMS when you're ready — this is a placeholder library.
        </p>
      </section>
    </main>
  );
}
