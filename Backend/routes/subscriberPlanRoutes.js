const express = require('express');
const SubscriberPlan = require('../models/SubscriberPlan');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Plan = require("../models/Plan");
const { verifyToken } = require("../middlewares/authMiddleware");
const { v4: uuidv4 } = require("uuid"); // For transaction_id
const router = express.Router();


// Generate unique transaction ID
const generateTransactionId = () => `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`;





// GET all subscriber plans
router.get("/subscriber-plans", async (req, res) => {
    try {
        const plans = await SubscriberPlan.find();
        res.json(plans);
    } catch (error) {
        res.status(500).json({ error: "Error fetching subscriber plans" });
    }
});



// Add or Replace Subscription Plan for a User
router.post("/subscribe", verifyToken, async (req, res) => {
    const { user_id, plan_id } = req.body; // plan_id is "P1001", "P1002", etc.

    try {
        const Plan = require("../models/Plan");
        const plan = await Plan.findById(plan_id); // Plan _id is "P1001", etc.

        if (!plan) {
            return res.status(404).json({ error: "Plan not found" });
        }

        const now = new Date();
        const payment_mode = "Online";
        const transaction_id = generateTransactionId();

        // 1️⃣ Update user record with plan name
        await User.findByIdAndUpdate(user_id, {
            subscription_plans: plan.name,   // save "Premium Plan"
            payment_status: "Paid",
        });

        // 2️⃣ Remove any old subscriber plan and add the new one
        await SubscriberPlan.deleteMany({ user_id });

        const newSubscriber = new SubscriberPlan({
            user_id,
            plan_id: plan._id,               // store "P1002"
            created_at: now,
        });
        await newSubscriber.save();

        // 3️⃣ Add a new payment record
        const newPayment = new Payment({
            user_id,
            plan_id: plan._id,               // store "P1002"
            payment_mode,
            payment_status: "Completed",
            transaction_id,
            amount: plan.price,
            created_at: now,
        });
        await newPayment.save();

        res.status(200).json({
            message: "Subscribed successfully!",
            transaction_id,
        });
    } catch (err) {
        console.error("❌ Subscription error:", err);
        res.status(500).json({ error: "Failed to subscribe" });
    }
});





module.exports = router;
