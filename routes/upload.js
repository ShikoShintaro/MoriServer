const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const router = express.Router();
const upload = multer({ dest : "temp/" });

router.post("/", upload.single("image"), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "profileImages",
        });

        console.log("CLOUDINARY URL:", result.secure_url);

        res.json({
            imageUrl : result.secure_url
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error : err.message });
    }
});

module.exports = router;