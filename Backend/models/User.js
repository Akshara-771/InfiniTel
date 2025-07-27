const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const Payment = require("./Payment");
const Plan = require('./Plan');



const UserSchema = new mongoose.Schema({
    _id: String,
    name: String,
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {

                return /^[0-9]{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    area: String,
    password: { type: String, required: true },
    subscription_plans: { type: String, default: "" },
    payment_status: String,
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    role: { type: String, enum: ["Customer", "Admin"], default: "Customer" }
});


// Hash password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.post('save', async function (doc, next) {
    try {
        if (doc.payment_status === "Paid" && doc.subscription_plans) {
            // Check if payment already exists
            const existingPayment = await Payment.findOne({ user_id: doc._id });

            if (!existingPayment) {
                // ✅ Fetch the plan using plan_id now
                const plan = await Plan.findOne({ plan_id: doc.subscription_plans });

                if (!plan) {
                    console.warn(`⚠️ Plan not found for plan_id: ${doc.subscription_plans}`);
                    return next(); // exit middleware safely
                }

                const newPayment = new Payment({
                    user_id: doc._id,
                    plan_id: plan.plan_id,
                    payment_mode: "Online",
                    payment_status: "Completed",
                    transaction_id: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
                    amount: plan.price,
                    created_at: new Date()
                });

                await newPayment.save();
                console.log(`✅ Payment recorded for user: ${doc._id}`);
            }
        }
        next();
    } catch (error) {
        console.error("❌ Error in post-save middleware:", error);
        next(error);
    }
});





const User = mongoose.model("User", UserSchema, "users");
module.exports = User;
