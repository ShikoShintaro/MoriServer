require('dotenv').config();
const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Event = require('../models/Events');
const Inbox = require('../models/Inbox');

const API = process.env.MORI_API_KEY

router.get("/", async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalEvents = await Event.countDocuments();
        const totalMessages = await Inbox.countDocuments();

        const lastUser = await User.findOne().sort({ createdAt : -1 });
        const lastEvent = await Event.findOne().sort({ createdAt : -1 });
        const lastMessage = await Inbox.findOne().sort({ createdAt : -1 });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const newUsersToday = await User.countDocuments({
            createdAt : { $gte : today }
        });

        
        const newEventsToday = await Event.countDocuments({
            createdAt : { $gte : today }
        });

        
        const newMessagesToday = await Inbox.countDocuments({
            createdAt : { $gte : today }
        });

        let moriStatus = "unknown";

        try {
            const response = await fetch(`${API}/admin/status`);
            const data = await response.json();
            moriStatus = data.status;
        } catch (err) {
            console.log("FastAPI not Reachable:", err.message);
        }

        res.json({
            success : true,

            counts : {
                users : totalUsers,
                events : totalEvents,
                messages : totalMessages
            },

            today : {
                users : newUsersToday,
                events : newEventsToday,
                messages : newMessagesToday
            },

            latest : {
                user : lastUser
                    ? {
                        name : lastUser.fullName || lastUser.username,
                        email : lastUser.email,
                        createdAt : lastUser.createdAt
                    }
                    : null,

                event : lastEvent
                    ? {
                        title : lastEvent.title,
                        createdAt : lastEvent.createdAt
                    }
                    : null,
                message : lastMessage
                    ? {
                        title : lastMessage.title,
                        createdaAt : lastMessage.createdAt
                    }
                    : null
            },

            server : {
                status : "online",
                time : new Date()
            },

            mori : {
                status : moriStatus
            }

        });

    } catch (err) {
        res.status(500).json ({
            success : false,
            message : err.message
        })
    }
})

module.exports = router;