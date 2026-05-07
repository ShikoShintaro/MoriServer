const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
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