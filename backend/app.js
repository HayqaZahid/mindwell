import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import moodRoutes from "./routes/mood.js";
import journalRoutes from "./routes/journal.js";
import habitRoutes from "./routes/habit.js";
import chatbotRoutes from "./routes/chatbot.js";
import communityRoutes from "./routes/community.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/habit", habitRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/community", communityRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

export default app;