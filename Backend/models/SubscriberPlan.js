const mongoose = require('mongoose');

const SubscriberPlanSchema = new mongoose.Schema({
    user_id: String,
    plan_id: String,
    created_at: { type: Date, default: Date.now }
}, { collection: 'subscriber_plans' });;

module.exports = mongoose.model('SubscriberPlan', SubscriberPlanSchema);
