const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    catwayNumber: Number,
    clientName: String,
    boatName: String,
    startDate: String,
    endDate: String
}, { strict: false });
module.exports = mongoose.model('reservationsDB', reservationSchema, 'reservationsDB');