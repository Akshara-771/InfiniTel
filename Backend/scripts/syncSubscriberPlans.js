const mongoose = require("mongoose");
const User = require("../models/User");
const SubscriberPlan = require("../models/SubscriberPlan");
const Plan = require("../models/Plan");

async function syncSubscriberPlans() {
    try {
        await mongoose.connect("mongodb+srv://Akshara:dbms_123@cluster0.fgcb3.mongodb.net/TelecomDBMS");

        const users = await User.find();

        for (const user of users) {
            const planName = user.subscription_plans;

            if (planName) {
                // ✅ Match based on the name now
                const plan = await Plan.findOne({ name: planName });

                if (plan) {
                    const planId = plan._id;

                    const exists = await SubscriberPlan.findOne({ user_id: user._id, plan_id: planId });
                    if (!exists) {
                        await new SubscriberPlan({
                            user_id: user._id,
                            plan_id: planId,
                            created_at: new Date()
                        }).save();
                        console.log(`✅ Added: { user_id: "${user._id}", plan_id: "${planId}" }`);
                    }
                } else {
                    console.warn(`⚠️ No matching plan found for name: "${planName}"`);
                }
            }
        }

        console.log("✅ Sync Completed!");
    } catch (error) {
        console.error("❌ Error syncing subscriber plans:", error);
    } finally {
        mongoose.disconnect();
    }
}

syncSubscriberPlans();
