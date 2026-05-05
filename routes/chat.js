const router = require("express").Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch(
      "https://8000-01khvck0a4b5095r1210t1kstp.cloudspaces.litng.ai/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      }
    );

    const data = await response.json();

    return res.json({
      reply: data.response || "No response from MORI",
    });
  } catch (err) {
    return res.status(500).json({
      reply: "MORI is unavailable",
    });
  }
});

module.exports = router;