const mongoose = require('mongoose');

const CatewaySchema = new mongoose.Schema({
    catewayNumber: String,
    catewayType: String,
    catewayState: String
}, { strict: false });

module.exports = mongoose.model('catawayDB', CatewaySchema, 'catawayDB');

