import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import BreathRing from "./BreathRing.jsx";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/mood", label: "Mood" },
  { to: "/journal", label: "Journal" },
  { to: "/habits", label: "Habits" },
  { to: "/breathing", label: "Breathe" },
  { to: "/chatbot", label: "Talk" },
  { to: "/community", label: "Community" },
  { to: "/resources", label: "Resources" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-20 bg-cloud/90 dark:bg-pine2/90 backdrop-blur border-b border-sage/20">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center gap-6">
        <div className="flex items-center gap-2 font-display text-lg text-pine dark:text-mist">
          <BreathRing size={28} />
          Mindwell
        </div>

        <nav className="hidden md:flex items-center gap-1 flex-1 overflow-x-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-pine text-cloud"
                    : "text-ink/70 dark:text-mist/70 hover:bg-sage/15"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label="Toggle calm dark mode"
            className="text-sm px-3 py-1.5 rounded-full border border-sage/40 hover:bg-sage/10"
          >
            {dark ? "☾ Dark" : "☀ Light"}
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="text-sm text-bloom hover:underline"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* mobile nav */}
      <nav className="md:hidden flex gap-1 px-5 pb-3 overflow-x-auto">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                isActive ? "bg-pine text-cloud" : "text-ink/70 dark:text-mist/70 hover:bg-sage/15"
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
