const express = require('express');
const router = express.Router();

router.post("/send", async (req, res) => {
    try {
        const {
            title, message, topic
        } = req.body;

        if (!title || !message || !topic) {
            return res.status(400).json({
                success: false,
                message: "Missing title or message"
            });
        }

        console.log("NEW EVENT");

        console.log({
            title, message, topic
        });

        return res.json({
            success: true,
            message: "Notification sent"
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
})

module.exports = router;