const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
    try {
        const users = await User.find().select(
            "username email fullName course section year verified profileImage"
        );

        res.json(users);

    } catch (err) {
        res.status(500).json({
            message : "Failed to fetch users"
        });
    };
});

router.put("/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                fullName: req.body.fullName,
                year: req.body.year,
                section: req.body.section,
                course: req.body.course
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            success: true,
            user: updatedUser
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;