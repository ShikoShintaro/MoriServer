const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    otp : {
        type: String
    },
    otpExpires : {
        type: Date
    },
    verified : {
        type : Boolean,
        default : false
    },
    resetOtp : {
        type : String,
    },
    resetOtpExpires : {
        type : Date
    },

    fullName : {
        type : String,
    },

    course : {
        type : String,
    },

    birthdate : {
        type : String,
    },

    section : {
        type : String,
    },

    year : {
        type : String,
    },
    profileImage : {
        type : String,
        default : ""
    }



});

module.exports = mongoose.model("User", UserSchema);