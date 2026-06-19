const express = require("express");
const router = express.Router();
const Inbox = require("../models/Inbox.js");

// SEND MESSAGE
router.post("/send", async (req, res) => {
    try {
        const { recipientEmail, title, message, type } = req.body;

        if (!recipientEmail || !title || !message) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const inbox = await Inbox.create({
            recipientEmail,
            title,
            message,
            type
        });

        return res.status(201).json({
            success: true,
            message: "Message sent",
            inbox
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


// GET MESSAGES BY EMAIL
router.get("/:email", async (req, res) => {
    try {
        const messages = await Inbox.find({
            recipientEmail: req.params.email
        }).sort({ createdAt: -1 }); // FIXED (was "created")

        return res.json({
            success: true,
            messages
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


// MARK AS READ
router.patch("/read/:id", async (req, res) => {
    try {
        await Inbox.findByIdAndUpdate(req.params.id, {
            isRead: true
        });

        res.json({
            success: true
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;