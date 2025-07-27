const mongoose = require('mongoose');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Plan = require('../models/Plan');

const DB_URI = "mongodb+srv://Akshara:dbms_123@cluster0.fgcb3.mongodb.net/TelecomDBMS";

async function syncPayments() {
    try {
        console.log("🔄 Connecting to database...");
        await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        console.log("🔄 Syncing payments for past users...");

        const users = await User.find({ payment_status: "Paid" });

        const operations = [];

        for (const user of users) {
            const existingPayment = await Payment.findOne({ user_id: user._id });

            if (!existingPayment && user.subscription_plans) {
                const plan = await Plan.findOne({ name: user.subscription_plans });

                if (!plan) {
                    console.warn(`⚠️ Plan not found for name: ${user.subscription_plans}`);
                    continue;
                }

                operations.push({
                    user_id: user._id,
                    plan_id: plan._id, // <-- This is like "P1001"
                    payment_mode: "Online",
                    payment_status: "Completed",
                    transaction_id: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
                    amount: plan.price,
                    created_at: new Date(),
                });
            }
        }

        if (operations.length > 0) {
            await Payment.insertMany(operations);
            console.log(`✅ ${operations.length} missing payments added.`);
        } else {
            console.log("✅ All past payments are already recorded.");
        }

        console.log("✅ Payment Sync Completed!");
    } catch (error) {
        console.error("❌ Error syncing payments:", error);
    } finally {
        mongoose.disconnect();
    }
}

syncPayments();
