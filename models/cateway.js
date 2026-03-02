const mongoose = require('mongoose');

const CatwaySchema = new mongoose.Schema({
    catwayNumber: Number,
    catwayType: String,
    catwayState: String
}, { strict: true });

module.exports = mongoose.model('catawayDB', CatwaySchema, 'catawayDB');

