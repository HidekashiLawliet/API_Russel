const mongoose = require('mongoose');

const CatawaySchema = new mongoose.Schema({
    catewayNumber: String,
    catewayType: String,
    catewayState: String
}, { strict: false });

module.exports = mongoose.model('catawayDB', CatawaySchema, 'catawayDB');

