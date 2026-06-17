const express = require("express");
const router = express.Router();
const Inbox = require("../models/Inbox.js");

router.post("/inbox/send", async (req, res) => {
    try {
        const { recipientEmail, title, message, type } = req.body;

        if ( !recipientEmail || !title || !message ) {
            return res.status(400).json({
                success : false,
                message : "Missing required fields"
            });
        }

        const inbox = await Inbox.create({
            recipientEmail,
            title,
            message,
            type
        });

        return res.status(201).json({
            success : true,
            message : "Message sent",
            inbox
        });

    } catch (err) {
        return res.status(500).json({
            success : false,
            message : err.message
        });
    }
});

router.get("/inbox/:email", async (req, res) => {
    try {
        const { email } = req.params;

        const messages = await Inbox.find({ recipientEmail: email })
            .sort({ created : -1 });

        return res.json({
            success : true,
            messages
        });

    } catch (err) {
        return res.status(500).json({
            success : false,
            message : err.message
        });
    }
});

router.post("/inbox/read/:id", async (req, res) => {
    await Inbox.findByIdAndUpdate(req.params.id, {
        isRead : true
    });

    res.json({
        success : true
    });
})

module.exports = router;