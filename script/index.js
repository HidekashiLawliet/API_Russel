const express = require("express");
const collection = require("../models/config");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, '../images');
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + (file.name));
    }
})
const upload = multer({ storage: storage })

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));


app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("../pages/login");
});

app.get("/signup", (req, res) => {
    res.render("../pages/signup");
});

app.get('/upload', (req, res) => {
    res.render("../pages/upload",);
});

app.post('/upload', upload.single('image'), async (req, res) => {
    res.send('File uploaded successfully');
});

function auth(req, res, next) {
    if (req.cookies && req.cookies.username) {
        next();
    } else {
        res.redirect('/');
    }
}

app.get('/home', auth, (req, res) => {
    const username = req.cookies.username || '';
    res.render("../pages/home", { username });
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        mail: req.body.email,
        password: req.body.password
    }
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
        await collection.insertOne(data);
        res.redirect("/");
    }
});

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            return res.send("User name cannot found");
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            return res.send("wrong Password");
        } else {
            res.cookie('username', check.name, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            return res.redirect('/home');
        }
    }
    catch {
        res.send("wrong Details");
    }
});

// Déconnexion
app.get('/logout', (req, res) => {
    res.clearCookie('username');
    res.redirect('/');
});


const port = 8080;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});