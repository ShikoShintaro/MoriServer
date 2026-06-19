const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Event = require('../models/Events');
const Inbox = require('../models/Inbox');

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