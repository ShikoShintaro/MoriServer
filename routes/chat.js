const router = require("express").Router();

router.post("/", async (req, res) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const apiUrl = process.env.MORI_API_URL;

    if (!apiUrl) {
      return res.status(500).json({ reply: "Missing MORI_API_URL" });
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: req.body.message,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({
        reply: "Invalid response from MORI API",
        raw: text,
      });
    }

    return res.json({
      reply: data.response ?? "No response from MORI",
    });

  } catch (err) {
    console.error("AI ERROR:", err);

    return res.status(500).json({
      reply: "MORI is currently offline",
    });
  }
});

module.exports = router;