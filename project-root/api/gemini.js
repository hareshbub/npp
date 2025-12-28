import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const { instruction } = req.body;
    const GEMINI_KEY = process.env.GEMINI_KEY;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GEMINI_KEY
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: instruction }] }]
        })
      }
    );

    const data = await response.json();
    const textOutput = data?.candidates?.[0]?.content?.[0]?.text || "No response";
    res.status(200).json({ reply: textOutput });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error connecting to Gemini 3" });
  }
}
