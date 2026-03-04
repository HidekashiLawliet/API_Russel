const express = require("express");
const collection = require("./models/config");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const multer = require('multer');
const mongoose = require('mongoose');
const Cateway = require('./models/cateway');
const UsersDB = require('./models/users')
const Reservation = require('./models/reservation');
const FileSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    data: Buffer,
    uploadedAt: { type: Date, default: Date.now }
});
const File = mongoose.model('File', FileSchema, 'files');
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use('/script', express.static(path.join(__dirname, 'script')));
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
    try {
        const file = req.file;
        if (!file) return res.status(400).send('No file uploaded');
        // create a document and save buffer to DB
        const Images = new File({
            filename: file.originalname,
            contentType: file.mimetype,
            data: file.buffer
        });
        await Images.save();
        res.redirect('/home');
    } catch (err) {
        console.error('Upload error', err);
        res.status(500).send('Error saving file');
    }
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

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.delete('/cateway/delete/:id', auth, async (req, res) => {
    const id = req.params.id;
    try {
        const deletedCateway = await Cateway.findByIdAndDelete(id);
        if (!deletedCateway) {
            return res.status(404).json({ message: 'Cateway not found' });
        }
        res.json({ message: 'Cateway deleted successfully' });
    } catch (err) {
        console.error('Error deleting catway:', err);
        res.status(500).json({ error: 'Unable to delete catway' });
    }
});

app.put('/catway/:catwayNumber/reservations/:reservationId', auth, async (req, res) => {
    const { catwayNumber } = req.params;
    const { clientName, boatName, startDate, endDate } = req.body;

    // validation minimale
    if (!clientName && !boatName && !startDate && !endDate) {
        return res.status(400).json({ error: 'Au moins un champ à mettre à jour est requis' });
    }
    console.log('Received update data:', req.body);
    const update = {};
    if (clientName !== undefined) update.clientName = clientName;
    if (boatName !== undefined) update.boatName = boatName;
    if (startDate !== undefined) update.startDate = startDate;
    if (endDate !== undefined) update.endDate = endDate;
    try {
        const updated = await Reservation.findOneAndUpdate(
            { catwayNumber: catwayNumber },
            update,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Reservation not found' });
        res.json(updated);
    } catch (err) {
        console.error('Error updating reservation:', err);
        res.status(500).json({ error: 'Unable to update reservation' });
    }
});

app.delete('/catway/:catwayNumber/reservations/:reservationId', auth, async (req, res) => {
    const { catwayNumber } = req.params;
    try {
        const deletedReservation = await Reservation.findOneAndDelete({
            catwayNumber: catwayNumber,
        });
        if (!deletedReservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        res.json({ message: 'Reservation deleted successfully' });
    } catch (err) {
        console.error('Error deleting reservation:', err);
        res.status(500).json({ error: 'Unable to delete reservation' });
    }
});

app.put('/cateway/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;
        if (updateData.catwayState === undefined || updateData.catwayState === "" || updateData.catwayState === null) {
            return res.status(400).json({ error: 'catwayState is required' });
        }
        const updatedCateway = await Cateway.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
        console.log('Updated Cateway:', updatedCateway);
        if (!updatedCateway) {
            return res.status(404).json({ message: 'Not found' });
        }
        res.json(updatedCateway);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to update' });
    }

});

app.post('/cateway/create', auth, async (req, res) => {
    try {
        const createCateway = await Cateway.create(req.body);
        res.status(201).json(createCateway);
    } catch (err) {
        console.error('Error creating catway:', err);
        res.status(500).json({ error: 'Unable to create catway' });
    }
})

app.post('/reservations/create', auth, async (req, res) => {
    try {
        console.log('received data:', req.body);
        const createdReservation = await Reservation.create(req.body);
        res.status(201).json(createdReservation);
        res.redirect('/home');
        if (!catway) {
            return res.status(404).json({ error: 'Catway not found' });
        }
    } catch (err) {
        console.error('Error creating reservation:', err);
        res.status(500).json({ error: 'Unable to create reservation' });
    }
});

app.get('/cateways', auth, async (req, res) => {
    try {
        const items = await Cateway.find({}).lean();
        res.json(items);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Unable to load cateways' });
    }
});

app.get('/users', auth, async (req, res) => {
    try {
        const items = await UsersDB.find({}).lean();
        res.json(items);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Unable to load users' });
    }
})

app.get('/catways/:id/reservations', auth, async (req, res) => {
    try {
        const catwayId = req.params.id;
        const catway = await Cateway.findById(catwayId);
        if (!catway) {
            return res.status(404).json({ error: 'Catway not found' });
        }
        const items = await Reservation.find({ catwayNumber: catway.catwayNumber }).lean();
        res.json(items);
    } catch (err) {
        console.error('Error fetching reservations', err);
        res.status(500).json({ error: 'Unable to load reservations' });
    }
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
async function startServer() {
    try {
        await collection.connectToDatabase();
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (error) {
        console.error('Startup failed:', error.message);
        process.exit(1);
    }
}
startServer();