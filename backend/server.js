const express = require('express');
const path = require('path');
const passport = require('passport');
const { pool } = require('./database');

// Create express app
const app = express();
const port = process.env.PORT || 3000;

// Controllers
const ingredientsController = require('./controllers/ingredients');
const menuController = require('./controllers/menu');
const ordersController = require('./controllers/orders');
const session = require('./controllers/session');
const reportsController = require('./controllers/reports');
const usersController = require('./controllers/users');
const imagesController = require('./controllers/images');

// Middleware
app.use(express.json());
app.use(express.raw({ 
    limit: '50mb',
    type: ['image/jpeg', 'image/png']
}));

app.use(session.sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/ingredients", ingredientsController);
app.use("/api/menu", menuController);
app.use("/api/orders", ordersController);
app.use("/api/session", session.router);
app.use("/api/reports", reportsController);
app.use("/api/users", usersController);
app.use("/api/images", imagesController);

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
