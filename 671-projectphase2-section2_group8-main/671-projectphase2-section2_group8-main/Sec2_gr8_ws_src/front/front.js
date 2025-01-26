const express = require("express");
const path = require('path');
const dotenv = require("dotenv");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');

// Initialize express app and dotenv
const app = express();
dotenv.config();

// Middleware setup
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../../Sec2_gr8_fe_src')));
app.use(express.static(path.join(__dirname, "../../sec2_grc8_fe_src/style")));
app.use(express.static(path.join(__dirname, "../../sec2_grc8_fe_src/html")));
app.use(express.static(path.join(__dirname, "../../sec2_grc8_fe_src/style/picture")));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Sec2_gr8_fe_src/html/Home.html'));
});

app.get('/navbar', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Sec2_gr8_fe_src/html/navbar.html'));
});

app.get('/menu', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Sec2_gr8_fe_src/html/menu.html'));
});

app.get('/promotion', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Sec2_gr8_fe_src/html/Promotion.html'));
});

app.get('/aboutus', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Sec2_gr8_fe_src/html/AboutusPage.html'));
});

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Sec2_gr8_fe_src/html/search.html'));
});

app.get('/snack', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Sec2_gr8_fe_src/html/snack.html'));
});

app.get('/topping', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Sec2_gr8_fe_src/html/topping.html'));
});

app.get('/drink', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Sec2_gr8_fe_src/html/drink.html'));
});

app.get('/description', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Sec2_gr8_fe_src/html/description.html'));
});

app.get('/sign_in', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Sec2_gr8_fe_src/html/LoginPage.html'));
});

// Middleware function to check if the user is logged in (cookie exists)
function goin(req, res, next) {
    const cookie = req.cookies['cookie'];
    console.log(cookie);
    if (cookie) {
        console.log("Cookie found:", cookie);
        next();
    } else {
        console.log("No cookie found. Access denied.");
        res.redirect('/');
    }
}

// Admin routes (protected with goin middleware)
app.get('/admin', goin, (req, res) => {
    res.sendFile(path.join(__dirname, '../../Sec2_gr8_fe_src/html/admin.html'));
});

app.get('/sidebar', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Sec2_gr8_fe_src/html/sidebar.html'));
});

app.get('/menu_admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Sec2_gr8_fe_src/html/menu_admin.html'));
});

app.get('/add_admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Sec2_gr8_fe_src/html/add_admin.html'));
});

app.get('/add_menu', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Sec2_gr8_fe_src/html/add_menu.html'));
});

app.get('/edit_admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Sec2_gr8_fe_src/html/edit_admin.html'));
});

app.get('/edit_menu', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Sec2_gr8_fe_src/html/edit_menu.html'));
});

// Start the server
app.listen(process.env.port, () => {
    console.log(`Server is running on port ${process.env.port}`);
});
