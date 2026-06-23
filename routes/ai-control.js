require("dotenv").config();
const express = require("express");
const router = express.Router();

let fetch;
if (typeof global.fetch === "function") {
    fetch = global.fetch;
} else {
    fetch = (...args) =>
        import("node-fetch").then(({ default: fetch }) => fetch(...args));
}

const API = process.env.MORI_API_KEY;

router.get("/stats", async (req, res) => {
    try {
        const response = await fetch(`${API}/stats`);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch stats",
            error: err.message
        });
    }
});

router.get("/analytics", async (req, res) => {
    try {
        const response = await fetch(`${API}/analytics`);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch analytics",
            error: err.message
        });
    }
});

router.get("/system-prompt", async (req, res) => {
    try {
        const response = await fetch(`${API}/system-prompt`);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch system prompt",
            error: err.message
        });
    }
});

router.post("/system-prompt", async (req, res) => {
    try {
        const response = await fetch(`${API}/system-prompt`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to save system prompt",
            error: err.message
        });
    }
});

module.exports = router;