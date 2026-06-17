const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title : String,
    message : String,

    topic : {
        type : String,
        enum : ["announcement", "event", "update", "system", "ai"],
        default : "announcement"
    },

    priority: {
        type : String,
        enum : ["low", "normal", "high"],
        default: "normal"
    },

    createdAt : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model("Events", eventSchema);