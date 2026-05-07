const axios = require("axios");

const sendCode = async (email, code, type) => {
    try {
        const res = await axios.post(
            "https://8000-01khvck0a4b5095r1210t1kstp.cloudspaces.litng.ai/send-otp",
            {
                email,
                code,
                type
            }
        );

        console.log("FastAPI email sent:", res.data);

        console.log("SENDING TO FASTAPI:", {
            email,
            code,
            type
        });

        return true;

    } catch (err) {
        console.log("Email send error:", err.message);
        return false;
    }


};

module.exports = sendCode;