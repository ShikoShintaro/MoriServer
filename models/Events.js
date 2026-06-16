const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title : String,
    message : String,

    topic : {
        type : String,
        enum : ["announcement", "event", "update", "system", "ai"],
        default : "announcement"
    },

    createdAt : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model("Events", eventSchema);