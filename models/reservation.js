
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    _id: String,
    catewayId: String,
    clientName: String,
    boatName: String,
    startDate: String,
    endDate: Date
}, { strict: false });
module.exports = mongoose.model('reservationsDB', reservationSchema, 'reservationsDB');