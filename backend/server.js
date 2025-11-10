const express = require('express');
const path = require('path');
require('dotenv').config()     // [Donnell]: I wrote this because dotenv wasn't loading for me. Feel free to refactor.

// Create express app
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());     // [Donnell]: I also had to add this for it to work. Idk why.

// Controllers
const ingredientsController = require('./controllers/ingredients');
const menuController = require('./controllers/menu');
const ordersController = require('./controllers/orders');
const sessionController = require('./controllers/session');
const reportsController = require('./controllers/reports');
const usersController = require('./controllers/users');

app.use("/api/ingredients", ingredientsController);
app.use("/api/menu", menuController);
app.use("/api/orders", ordersController);
app.use("/api/session", sessionController.router);
app.use("/api/reports", reportsController);
app.use("/api/users", usersController);

// Serve React app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Handle any other routes by serving the React app's index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Add process hook to shutdown pool
process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});

app.set("view engine", "ejs");

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


