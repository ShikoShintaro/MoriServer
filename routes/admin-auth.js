const express = require("express");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        const admin = await Admin.findOne({
            username
        });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const match = await bcrypt.compare(
            password,
            admin.password
        );

        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        res.json({
            success: true,
            admin: {
                id: admin._id,
                username: admin.username,
                role: admin.role
            }
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});

router.post("/create", async (req, res) => {
    try {
        const {
            username,
            password,
            role
        } = req.body

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        const existing = await Admin.findOne({
            username
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Admin already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const admin = await Admin.create({
            username,
            password: hashedPassword,
            role: role || "admin"
        });

        res.status(201).json({
            success: true,
            message: "Admin created",
            role: admin.role
        });

    } catch (err) {
        res.status(500).json({
            success: true,
            message: err.message
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const admins = await Admin.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            admins
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Admin.findByIdAndDelete(
            req.params.id
        );

        if (!deleted) {
            return res.status(404).json({
                success : false,
                message : "Admin not found"
            });
        }

        res.json({
            success : true,
            message : "Admin deleted"
        });
 
    } catch (err) {
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
});

module.exports = router;