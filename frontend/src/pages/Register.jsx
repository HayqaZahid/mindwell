import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import BreathRing from "../components/BreathRing.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create your account. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-sage/10 animate-driftSlow" />
      <div className="absolute -bottom-24 -left-10 w-80 h-80 rounded-full bg-bloom/10 animate-driftSlow" />

      <div className="relative w-full max-w-sm bg-cloud rounded-xl2 shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <BreathRing size={48} />
          <h1 className="font-display text-2xl text-pine mt-3">Start your space</h1>
          <p className="text-sm text-ink/60 mt-1">A private place to track how you're really doing.</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm text-ink/70">Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-sage/30 px-3 py-2 focus:outline-none"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-sm text-ink/70">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-sage/30 px-3 py-2 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm text-ink/70">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-sage/30 px-3 py-2 focus:outline-none"
              placeholder="At least 6 characters"
            />
          </div>

          {error && <p className="text-sm text-bloom">{error}</p>}

          <button
            disabled={busy}
            className="w-full bg-pine text-cloud rounded-lg py-2.5 font-medium hover:bg-pine2 transition-colors disabled:opacity-60"
          >
            {busy ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-sm text-center text-ink/60 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-bloom hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
