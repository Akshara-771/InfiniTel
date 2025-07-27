const express = require('express');
const Payment = require('../models/Payment');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const User = require("../models/User");



router.get("/payment/:user_id", verifyToken, async (req, res) => {
    try {
        const { user_id } = req.params;

        // Regular users can only view their own payment records
        if (req.user.role !== "Admin" && req.user._id !== user_id) {
            return res.status(403).json({ message: "Access denied. You can only view your own payment records." });
        }

        // Find payment record for the user
        const payment = await Payment.findOne({ user_id });

        if (!payment) {
            return res.json([]); // ✅ Return empty array if no payments
        }
        res.json([payment]); // ✅ Wrap in array for consistency with frontend

    } catch (error) {
        console.error("Error fetching payment details:", error);
        res.status(500).json({ message: "Server error, unable to fetch payment details." });
    }
});


router.get("/payments", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const payments = await Payment.find().lean(); // Fetch all payments

        // Fetch user details for each payment and add `name` field
        const userIds = payments.map(p => p.user_id);
        const users = await User.find({ _id: { $in: userIds } }).lean();

        // Map user names to payments
        const userMap = users.reduce((acc, user) => {
            acc[user._id] = user.name;
            return acc;
        }, {});

        const paymentsWithNames = payments.map(payment => ({
            ...payment,
            name: userMap[payment.user_id] || "Unknown"
        }));

        res.json(paymentsWithNames);
    } catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).json({ error: "Server error" });
    }
});




module.exports = router;
