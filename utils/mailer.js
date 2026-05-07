const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendCode = async (to, code) => {
    try {
        const result = await resend.emails.send({
            from: "MORI AI <onboarding@resend.dev>",
            to,
            subject: "MORI AI Verification Code",
            text: `Your Verification code is ${code}`
        });

        console.log("OTP sent:", result);
        return true;

    } catch (err) {
        console.log("Resend error:", err);
        return false;
    }
};

module.exports = sendCode;