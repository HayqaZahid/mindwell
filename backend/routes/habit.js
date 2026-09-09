import express from "express";
import Habit from "../models/Habit.js";
import protect from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

// POST /api/habit  - log or update today's habit entry
router.post("/", async (req, res) => {
  try {
    const { waterGlasses, exerciseMinutes, meditationMinutes, sleepHours, sleepQuality } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let entry = await Habit.findOne({ user: req.userId, date: { $gte: today, $lt: tomorrow } });

    if (entry) {
      Object.assign(entry, { waterGlasses, exerciseMinutes, meditationMinutes, sleepHours, sleepQuality });
      await entry.save();
    } else {
      entry = await Habit.create({
        user: req.userId,
        date: today,
        waterGlasses,
        exerciseMinutes,
        meditationMinutes,
        sleepHours,
        sleepQuality,
      });
    }

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: "Could not save habit entry", error: err.message });
  }
});

// GET /api/habit?days=30
router.get("/", async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const entries = await Habit.find({ user: req.userId, date: { $gte: since } }).sort({ date: 1 });
  res.json(entries);
});

export default router;
