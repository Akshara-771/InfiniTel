const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const Area = require("../models/Area");

// Get all areas
router.get("/areas", verifyToken, async (req, res) => {
    try {
        const areas = await Area.find();
        res.json(areas);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
