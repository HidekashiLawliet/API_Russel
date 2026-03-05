const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    catwayNumber: Number,
    clientName: String,
    boatName: String,
    startDate: Date,
    endDate: Date
}, { strict: false });
module.exports = mongoose.model('reservationsDB', reservationSchema, 'reservationsDB');