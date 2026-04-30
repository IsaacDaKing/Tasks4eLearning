import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware lets the backend read JSON requests from the frontend.
app.use(cors());
app.use(express.json());

// Express serves all HTML, CSS, and frontend JavaScript from the public folder.
app.use(express.static(path.join(__dirname, "public")));

const fallbackStudyPlan = (assignments, availableHours, studyStyle) => {
  const hours = Number(availableHours) || 2;
  const totalMinutes = Math.max(30, Math.round(hours * 60));
  const firstBlock = Math.round(totalMinutes * 0.45);
  const secondBlock = Math.round(totalMinutes * 0.35);
  const finalBlock = totalMinutes - firstBlock - secondBlock;
  const topAssignments = [...assignments].slice(0, 3);

  return `Demo Study Plan (${studyStyle})\n\n` +
    `1. ${firstBlock} minutes: Start with ${topAssignments[0]?.title || "your highest priority assignment"}. Review requirements, outline your work, and complete the most difficult section first.\n` +
    `2. ${secondBlock} minutes: Move to ${topAssignments[1]?.title || "your next assignment"}. Focus on practice problems, notes, or a draft submission.\n` +
    `3. ${finalBlock} minutes: Quick review for ${topAssignments[2]?.title || "remaining coursework"}. Check due dates and write down one next step for tomorrow.\n\n` +
    `Priority reasoning: This plan starts with the closest and highest priority work, then shifts to review so you do not spend all your energy on one class.\n\n` +
    `You have a clear path for today. Start small and keep moving.`;
};

app.post("/api/study-plan", async (req, res) => {
  try {
    const { assignments, availableHours, studyStyle } = req.body;

    const prompt = `
Create a concise student-friendly study plan.

Available study hours today: ${availableHours}
Preferred study style: ${studyStyle}

Assignments:
${assignments
  .map((a) => `- ${a.title}, due ${a.dueDate}, course: ${a.course}, priority: ${a.priority}`)
  .join("\n")}

The plan should include:
- assignment prioritization
- time blocks
- short reasoning
- motivational closing sentence
Keep it short enough for a class demo.
`;

    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3.2",
        prompt,
        stream: false
      })
    });

    if (!ollamaResponse.ok) {
      throw new Error("Ollama request failed");
    }

    const data = await ollamaResponse.json();

    res.json({
      studyPlan: data.response,
      source: "ollama"
    });
  } catch (error) {
    console.error("Study plan error:", error);

    res.json({
      studyPlan: createFallbackStudyPlan(
        req.body.availableHours,
        req.body.studyStyle,
        req.body.assignments
      ),
      source: "fallback"
    });
  }
});