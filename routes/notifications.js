const express = require("express");
const router = express.Router();
const Event = require("../models/Events");

router.post("/send", async (req, res) => {
    try {
        const {
            title, message, topic
        } = req.body;

        if (!title || !message || !topic) {
            return res.status(400).json({
                success : false,
                message : "Missing : Title, message or topic"
            });
        }

        const newEvent = await Event.create({
            title,
            message,
            topic,
            priority : priority || "normal"
        });

        console.log("NEW EVENT SAVED", {
            id : newEvent._id,
            title : newEvent.title,
            topic : newEvent.topic
        });

        return res.status(201).json({
            success : true,
            message : "Notification sent successfully",
            event : newEvent
        });
    } catch (err) {
        console.error("Event Error: ", err);

        return res.status(500).json({
            success: false,
            message: "Server error while saving event"
        });
    }
});

router.get("/latest", async (req, res) => {
    try {
        const { after } = req.query;

        let query = {};

        if (after) {
            query.createdAt = { $gt : new Date(after) }; 
        }

        const events = await Event.find(query)
            .sort({ createdAt : -1 })
            .limit(20);

        return res.json({
            success : true,
            events
        });
    } catch (err) {
        return res.status(500).json({
            success : false,
            message : err.message
        });
    }
});

module.exports = router;