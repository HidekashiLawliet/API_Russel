const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
let isConnected = false;

async function connectToDatabase() {
    if (isConnected) {
        return;
    }

    if (!mongoUri) {
        throw new Error('Missing MongoDB URI. Set MONGODB_URI (or MONGO_URI) in .env');
    }

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    isConnected = true;
    console.log('Database Connected Successfully on port:', mongoose.connection.port);
}

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
module.exports.connectToDatabase = connectToDatabase;