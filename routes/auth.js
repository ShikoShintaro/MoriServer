const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const sendCode = require("../utils/mailer");

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields required"
            });
        }

        const existingUser = await User.findOne({ email });

        const code = generateOtp();
        const otpExpires = Date.now() + 5 * 60 * 1000;

        if (existingUser && existingUser.verified) {
            return res.status(409).json({
                message: "Email already registered and verified",
                status: "EXISTS"
            });
        }
        if (existingUser && !existingUser.verified) {

            existingUser.username = username;
            existingUser.password = await bcrypt.hash(password, 10);
            existingUser.otp = code;
            existingUser.otpExpires = otpExpires;

            await existingUser.save();

            sendCode(email, code, "verify");

            return res.json({
                message: "OTP resent",
                status: "PENDING_OTP"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            otp: code,
            otpExpires: otpExpires,
            verified: false
        });

        await newUser.save();

        sendCode(email, code, "verify");

        return res.json({
            message: "Verification Code Sent",
            status: "NEW"
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
});

router.post("/login", async (req, res) => {
    try {

        const login = req.body?.email?.trim(); // FIXED
        const password = req.body?.password?.trim();

        console.log("Login: ", login);
        console.log("Password: ", password);

        if (!login || !password) {
            return res.status(400).json({ message: "All fields required!" });
        }

        const user = await User.findOne({
            $or: [
                { email: login },
                { username: login }
            ]
        });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        if (!user.verified) {
            return res.status(400).json({ message: "Account not verified" });
        }

        return res.json({
            message: "Login Success",
            email: user.email
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post("/verify", async (req, res) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({
                message: "Code expired"
            });
        }

        if (String(user.otp) !== String(code)) {
            return res.status(400).json({
                message: "Invalid Code"
            });
        }

        user.verified = true;
        user.otp = null;
        user.otpExpires = null;

        await user.save();

        return res.json({
            message: "Account verified successfully"
        });

    } catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
});

router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const code = generateOtp();

        user.resetOtp = code;
        user.resetOtpExpires = Date.now() + 5 * 60 * 1000;

        await user.save();

        sendCode(email, code, "reset")
            .then(() => console.log("OTP email sent"))
            .catch(err => console.log("Email error:", err));

        return res.json({ message: "Reset OTP sent!" });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post("/verify-reset", async (req, res) => {
    try {
        console.log(req.body);

        const { email, code } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user.resetOtpExpires < Date.now()) {
            return res.status(400).json({ message: "Code expired" });
        }

        return res.json({ message: "OTP verified" });

    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
});

router.post("/reset-password", async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ message: "Password required" });
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = null;
        user.resetOtpExpires = null;

        await user.save();

        return res.json({ message: "Password reset successful " });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});



router.post("/student-info", async (req, res) => {
    try {
        const { email, fullName, course, birthdate, section, year } = req.body;

        if (!email || !fullName || !course || !birthdate || !section || !year) {
            return res.status(400).json({ message: "All fields required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        user.fullName = fullName;
        user.course = course;
        user.birthdate = birthdate;
        user.section = section;
        user.year = year;

        await user.save();

        return res.json({ message: "Student info updated successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post("/update-profile-image", async (req, res) => {
    try {
        const { email, imageUrl } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        user.profileImage = imageUrl;
        await user.save();

        res.json(({ message: "Profile image updated" }));

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});

router.post("/get-profile", async (req, res) => {
    try {
        const { email } = req.body;

        console.log("EMAIL:", email);

        const user = await User.findOne({ email });

        if (!user) {
            console.log("USER NOT FOUND")
            return res.status(500).json({ message: "User not found" });
        }

        console.log("DB IMAGE:", user.profileImage);

        res.json({
            imageUrl: user.profileImage || "",
            fullName: user.fullName || "",
            course: user.course || "",
            year: user.year || "",
            section: user.section || "",
            birthdate: user.birthdate || "",

        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})



module.exports = router;