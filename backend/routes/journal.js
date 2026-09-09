import express from "express";
import Journal from "../models/Journal.js";
import protect from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

// POST /api/journal  - create a journal / gratitude / reframe entry
router.post("/", async (req, res) => {
  try {
    const { type, title, content, negativeThought, distortion, reframedThought } = req.body;
    if (!content) return res.status(400).json({ message: "Entry content is required" });

    const entry = await Journal.create({
      user: req.userId,
      type: type || "journal",
      title,
      content,
      negativeThought,
      distortion,
      reframedThought,
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: "Could not save entry", error: err.message });
  }
});

// GET /api/journal?type=journal|gratitude|reframe  - list entries, most recent first
router.get("/", async (req, res) => {
  const filter = { user: req.userId };
  if (req.query.type) filter.type = req.query.type;
  const entries = await Journal.find(filter).sort({ date: -1 });
  res.json(entries);
});

// DELETE /api/journal/:id
router.delete("/:id", async (req, res) => {
  await Journal.deleteOne({ _id: req.params.id, user: req.userId });
  res.json({ message: "Entry deleted" });
});

export default router;
