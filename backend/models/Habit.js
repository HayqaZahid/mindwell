import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    waterGlasses: { type: Number, default: 0 },
    exerciseMinutes: { type: Number, default: 0 },
    meditationMinutes: { type: Number, default: 0 },
    sleepHours: { type: Number, default: 0 },
    sleepQuality: { type: Number, min: 1, max: 5, default: 3 },
  },
  { timestamps: true }
);

export default mongoose.model("Habit", habitSchema);
