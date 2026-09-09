import express from "express";
import protect from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

const SYSTEM_PROMPT = `You are a warm, supportive listening companion inside a mental wellbeing app called Mindwell.
You are NOT a therapist and you never diagnose, prescribe, or claim to treat any condition.
Your role: listen, reflect feelings back, ask gentle open questions, and offer general, non-clinical
coping ideas (breathing, grounding, journaling, going for a walk, reaching out to someone they trust).
Keep replies short (2-5 sentences), warm, and conversational, not clinical or listy.
If someone mentions self-harm, suicide, or being in crisis, gently and clearly encourage them to
contact a crisis line or trusted person right away, and mention that in many countries you can call
or text 988 (US) for the Suicide & Crisis Lifeline, and let them know you are not able to help further
with anything unsafe. Do not attempt to talk them out of it yourself beyond that; encourage real help.`;

router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: "messages array is required" });
    }
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Server is missing GEMINI_API_KEY in .env" });
    }

    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
  console.error("Gemini API error:", JSON.stringify(data));
  return res.status(response.status).json({ message: "Chatbot request failed", detail: data });
}

    const reply =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
      "I'm here, but I'm not sure how to respond to that.";
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ message: "Chatbot request failed", error: err.message });
  }
});

export default router;