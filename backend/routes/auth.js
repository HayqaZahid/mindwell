import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import protect from "../middleware/auth.js";

const router = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are all required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({
      token: signToken(user._id),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    res.json({
      token: signToken(user._id),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// GET /api/auth/me
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// POST /api/auth/checkin  (call once per day to update streaks, e.g. from the dashboard)
router.post("/checkin", protect, async (req, res) => {
  const user = await User.findById(req.userId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const last = user.lastCheckIn ? new Date(user.lastCheckIn) : null;
  if (last) last.setHours(0, 0, 0, 0);

  if (last && last.getTime() === today.getTime()) {
    return res.json({ currentStreak: user.currentStreak, longestStreak: user.longestStreak, alreadyCheckedIn: true });
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (last && last.getTime() === yesterday.getTime()) {
    user.currentStreak += 1;
  } else {
    user.currentStreak = 1;
  }

  user.longestStreak = Math.max(user.longestStreak, user.currentStreak);
  user.lastCheckIn = today;
  await user.save();

  res.json({ currentStreak: user.currentStreak, longestStreak: user.longestStreak, alreadyCheckedIn: false });
});

export default router;
