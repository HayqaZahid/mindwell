import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    authorAlias: { type: String, default: "Anonymous" },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorAlias: { type: String, default: "Anonymous" },
    content: { type: String, required: true },
    topic: { type: String, default: "general" }, // anxiety, stress, sleep, general, wins
    supportCount: { type: Number, default: 0 },
    replies: [replySchema],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
