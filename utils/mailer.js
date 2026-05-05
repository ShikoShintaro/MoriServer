const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS
    }
});

const sendCode = async (to, code) => {
    await transporter.sendMail({
        from: "MORI AI TEAM",
        to,
        subject : "MORI AI Verification Code",
        text : `Your Verification code is ${code}` 
    })
}

module.exports = sendCode;