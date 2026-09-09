/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        mist: "#EEF1EA", // page background, soft eucalyptus stone
        pine: "#1F4E4A", // deep teal, primary
        pine2: "#163C39", // darker pine for hover states
        bloom: "#C97B84", // dusty rose accent
        amber: "#C9A24B", // warm gold, used for streaks/badges
        ink: "#1B2B27", // near-black text with a green undertone
        sage: "#7C9885", // muted secondary green
        cloud: "#FBFBF8", // card background, warmer than white
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(0.85)" },
          "50%": { transform: "scale(1.15)" },
        },
        driftSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        breathe: "breathe 8s ease-in-out infinite",
        driftSlow: "driftSlow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
