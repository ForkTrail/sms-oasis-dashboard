import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/syncServices", async (req, res) => {
  try {
    const apiKey = process.env.SMS_ACTIVATE_API_KEY;
    console.log("[DEBUG] Using SMS_ACTIVATE_API_KEY:", apiKey);
    const url = `https://api.sms-activate.org/api2.php?api_key=${apiKey}&action=getPrices&country=0`;

    const response = await fetch(url);
    const text = await response.text();
    console.log("[DEBUG] Raw response from sms-activate v2:", text);

    if (!response.ok) {
      console.error("SMS-Activate API v2 Error:", response.status, text);
      return res.status(response.status).json({
        error: "Failed to fetch from SMS-Activate API v2",
        body: text,
        status: response.status
      });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("[DEBUG] JSON parse error. Raw text:", text);
      return res.status(500).json({ error: "Invalid response from SMS-Activate API v2", body: text });
    }
    res.json(data);
  } catch (err) {
    console.error("Fetch failed:", err.message || err);
    res.status(500).json({ error: "Unexpected error", details: err.message || err });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
