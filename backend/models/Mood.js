import mongoose from "mongoose";

const moodSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    score: { type: Number, required: true, min: 1, max: 5 }, // 1 = very low, 5 = great
    note: { type: String, default: "" },
    tags: [{ type: String }], // e.g. "sleep", "work", "social", "exercise"
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Mood", moodSchema);
