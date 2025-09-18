import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.get("/", (req, res) => {
  res.send("Gemini Chat API is running. Use POST /api/chat for chatbot.");
});

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ reply: "Missing Gemini API key." });
  }

  try {
    // Combine messages into a single prompt (Gemini needs text input)
    const userPrompt = messages
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n");

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res
        .status(500)
        .json({ reply: data.error?.message || "Error from Gemini API." });
    }

    res.json({
      reply:
        data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "Sorry, I couldn't process that.",
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ reply: "Error connecting to Gemini." });
  }
});

// helper to build the medical prompt
const buildPrompt = (reportData) => `
You are a helpful medical assistant.  
Given the following patient pain mapping data in JSON, generate a report with three sections:

1. 🩹 **Basic First Aid** – steps for immediate relief at home.  
2. 🩺 **Possible Medical Issues** – what conditions might be causing this.  
3. 📍 **When to Seek Professional Help** – red flags that mean urgent care is needed.

Use clear, friendly, non-technical language.

Pain Mapping Data:
${JSON.stringify(reportData, null, 2)}
`;

// NEW endpoint
app.post("/api/report", async (req, res) => {
  const { reportData } = req.body;

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ reply: "Missing Gemini API key." });
  }

  try {
    const prompt = buildPrompt(reportData);

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res
        .status(500)
        .json({ reply: data.error?.message || "Error from Gemini API." });
    }

    res.json({
      reply:
        data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "Sorry, I couldn't process that.",
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ reply: "Error connecting to Gemini." });
  }
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`✅ Gemini chat backend running on http://localhost:${PORT}`)
);
