const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    plan_id: { type: String, required: true },
    payment_mode: { type: String, enum: ["Online", "Card", "UPI", "Other"], required: true },
    payment_status: { type: String, enum: ["Pending", "Completed", "Failed"], required: true },
    transaction_id: { type: String, unique: true },
    amount: { type: Number, required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', PaymentSchema);
