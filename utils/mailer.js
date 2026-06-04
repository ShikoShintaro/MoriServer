const axios = require("axios");

const sendCode = async (email, code, type) => {
    try {
        const res = await axios.post(
            "https://8000-01khvck0a4b5095r1210t1kstk.cloudspaces.litng.ai/send-otp",
            { email, code, type },
            {
                headers: { "Content-Type": "application/json" },
                timeout: 10000
            }
        );

        console.log("FastAPI RESPONSE:", res.data);

        if (res.status === 200 && res.data?.success !== false) {
            return true;
        }

        return false;

    } catch (err) {
        console.log("FASTAPI ERROR STATUS:", err.response?.status);
        console.log("FASTAPI ERROR DATA:", err.response?.data);
        console.log("FASTAPI NETWORK ERROR:", err.message);

        return false;
    }
};

module.exports = sendCode;