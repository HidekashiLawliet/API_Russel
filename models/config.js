const mongoose = require('mongoose');
require('dotenv').config()
const connect = mongoose.connect(process.env.MONGODB_URI);
// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully on port: ", mongoose.connection.port);
})
    .catch(() => {
        console.log("Database cannot be Connected");
    })

// Create Schema
const Loginschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// collection part
const collection = new mongoose.model("UserDB", Loginschema, "UserDB");

module.exports = collection;