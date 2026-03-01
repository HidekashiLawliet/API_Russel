const express = require('express');
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require('path');
const { MongoClient } = require('mongodb');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const User = require("./script/register");


mongoose.connect("mongodb+srv://anonyme:anonymepassword@apicef.y4m4tim.mongodb.net/")
    .then(() => console.log("Connected to MongoDB ✅"))
    .catch((err) => console.error("MongoDB connection error ❌", err));

app.listen(port, () => {
    console.log('Server app listening to port', port);
});

app.get('', (req, res) => {
    res.send('Welcome to the root of the project');
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'login.html'));
});


app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'register.html'));
});

app.post("/register", async (req, res) => {
    try {
        const { nom, email, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            nom,
            email,
            password: passwordHash
        });

        await newUser.save();

        res.status(201).json({
            message: "User created successfully ✅",
            user: newUser
        });

    } catch (error) {
        console.error("FULL ERROR:", error);
        res.status(500).json({
            message: error.message,
            stack: error.stack
        });
    }
});

app.get('/about', (req, res) => {
    res.send('Welcome to the about page');
});

app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
})

app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500).send('Something broke!');
})

module.exports = app;