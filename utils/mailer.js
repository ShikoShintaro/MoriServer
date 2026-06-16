const axios = require("axios");

const sendCode = async (email, code, type) => {
    try {
        console.log("SENDING TO FASTAPI:", {
            email,
            code,
            type
        });

        const res = await axios.post(
            process.env.MORI_EMAIL_SENDER,
            { email, code, type },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("FastAPI SUCCESS:", res.data);
        return true;

    } catch (err) {
        console.log("FASTAPI ERROR STATUS:", err.response?.status);
        console.log("FASTAPI ERROR DATA:", err.response?.data);
        return false;
    }
};

module.exports = sendCode;