const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

    host: "smtp.gmail.com",
    port: 587,
    secure: false, 

    tls: {
        rejectUnauthorized: false
    }
});

const sendCode = async (to, code) => {
    try {
        await transporter.sendMail({
            from: `"MORI AI TEAM" <${process.env.EMAIL_USER}>`,
            to,
            subject: "MORI AI Verification Code",
            text: `Your Verification code is ${code}`
        });

        console.log("OTP email sent to:", to);
    } catch (err) {
        console.log("Email send error:", err);
        throw err;
    }
};

module.exports = sendCode;