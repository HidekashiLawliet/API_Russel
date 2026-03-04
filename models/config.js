const mongoose = require('mongoose');
require('dotenv').config()
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
const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    mail: {
        type: String,
    },
    password: {
        type: String,
    }
});

// collection part
const collection = new mongoose.model("UserDB", userSchema, "UserDB");

module.exports = collection;
module.exports.connectToDatabase = connectToDatabase;