const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    _id: String,
    name: String,
    features: [String],
    payment_terms: String,
    price: Number
});

module.exports = mongoose.model('Plan', PlanSchema);
