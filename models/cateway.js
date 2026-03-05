const mongoose = require('mongoose');

const CatwaySchema = new mongoose.Schema({
    catwayNumber: Number,
    catwayType: String,
    catwayState: String
}, { strict: false });

module.exports = mongoose.model('catawayDB', CatwaySchema, 'catawayDB');

