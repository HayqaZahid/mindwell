import express from "express";
import Post from "../models/Post.js";
import protect from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

const BANNED_WORDS = []; // add simple moderation keywords here if you want basic filtering

const containsBannedWord = (text) =>
  BANNED_WORDS.some((word) => text.toLowerCase().includes(word.toLowerCase()));

// GET /api/community?topic=anxiety
router.get("/", async (req, res) => {
  const filter = {};
  if (req.query.topic && req.query.topic !== "all") filter.topic = req.query.topic;
  const posts = await Post.find(filter).sort({ createdAt: -1 }).limit(100);
  res.json(posts);
});

// POST /api/community  - body: { content, topic, authorAlias }
router.post("/", async (req, res) => {
  const { content, topic, authorAlias } = req.body;
  if (!content || content.trim().length < 2) {
    return res.status(400).json({ message: "Post content is required" });
  }
  if (containsBannedWord(content)) {
    return res.status(400).json({ message: "This post was blocked by community guidelines" });
  }

  const post = await Post.create({
    user: req.userId,
    content,
    topic: topic || "general",
    authorAlias: authorAlias || "Anonymous",
  });
  res.status(201).json(post);
});

// POST /api/community/:id/support  - "I support you" tap, no comment needed
router.post("/:id/support", async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { supportCount: 1 } }, { new: true });
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

// POST /api/community/:id/reply
router.post("/:id/reply", async (req, res) => {
  const { content, authorAlias } = req.body;
  if (!content) return res.status(400).json({ message: "Reply content is required" });
  if (containsBannedWord(content)) {
    return res.status(400).json({ message: "This reply was blocked by community guidelines" });
  }

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  post.replies.push({ content, authorAlias: authorAlias || "Anonymous" });
  await post.save();
  res.status(201).json(post);
});

export default router;
