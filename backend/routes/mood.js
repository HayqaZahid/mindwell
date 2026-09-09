import express from "express";
import Mood from "../models/Mood.js";
import protect from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

// POST /api/mood  - log a mood entry
router.post("/", async (req, res) => {
  try {
    const { score, note, tags } = req.body;
    if (!score) return res.status(400).json({ message: "A mood score is required" });

    const entry = await Mood.create({ user: req.userId, score, note, tags });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: "Could not save mood entry", error: err.message });
  }
});

// GET /api/mood  - all entries for the logged-in user, most recent first
router.get("/", async (req, res) => {
  const entries = await Mood.find({ user: req.userId }).sort({ date: -1 });
  res.json(entries);
});

// GET /api/mood/trend?days=30 - entries within the last N days, oldest first (good for charts)
router.get("/trend", async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const entries = await Mood.find({ user: req.userId, date: { $gte: since } }).sort({ date: 1 });
  res.json(entries);
});

// DELETE /api/mood/:id
router.delete("/:id", async (req, res) => {
  await Mood.deleteOne({ _id: req.params.id, user: req.userId });
  res.json({ message: "Mood entry deleted" });
});

export default router;
