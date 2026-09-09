// The app's signature element: a slow, layered ring that pulses like a breath.
// Used small as a logo mark, and large on the Breathing exercise page.
export default function BreathRing({ size = 40, animate = true }) {
  return (
    <div
      className={`relative shrink-0 ${animate ? "animate-breathe" : ""}`}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 rounded-full border-2 border-pine/40" />
      <div className="absolute inset-[15%] rounded-full border-2 border-bloom/60" />
      <div className="absolute inset-[35%] rounded-full bg-pine" />
    </div>
  );
}
