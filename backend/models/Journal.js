import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["journal", "gratitude", "reframe"], default: "journal" },
    title: { type: String, default: "" },
    content: { type: String, required: true },
    // used only for type "reframe" (CBT-style thought reframing)
    negativeThought: { type: String, default: "" },
    distortion: { type: String, default: "" },
    reframedThought: { type: String, default: "" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Journal", journalSchema);
