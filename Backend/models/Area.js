const mongoose = require('mongoose');

const AreaSchema = new mongoose.Schema({
    _id: String,
    state: String,
    district: String
});

module.exports = mongoose.model('Area', AreaSchema);
