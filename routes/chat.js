const router = require("express").Router();

router.post("/", async (req, res) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch("https://8000-01khvck0a4b5095r1210t1kstp.cloudspaces.litng.ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: req.body.message }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    const data = await response.json();

    return res.json({
      reply: data.response || "No response from MORI"
    });

  } catch (err) {
    console.error("AI ERROR:", err.message);

    return res.status(500).json({
      reply: "MORI is currently offline"
    });
  }
});

module.exports = router;
