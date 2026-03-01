const mongoose = require('mongoose');

const CatewaySchema = new mongoose.Schema({
    _id: String,
    catewayNumber: String,
    catewayType: String,
    catewayState: String
}, { strict: false });

module.exports = mongoose.model('catawayDB', CatewaySchema, 'catawayDB');

