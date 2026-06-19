const mongoose = require("mongoose");

const inboxSchema = new mongoose.Schema({
    recipientEmail: {
        type: String,
        required: true,
        index: true
    },

    title: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ["announcement", "event", "update", "system"],
        default: "system"
    },

    isRead: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Inbox", inboxSchema);