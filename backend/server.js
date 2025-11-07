const express = require('express');

// Create express app
const app = express();
const port = process.env.PORT || 3000;

// Controllers
const ingredientsController = require('./controllers/ingredients');
const menuController = require('./controllers/menu');
const ordersController = require('./controllers/orders');
const sessionController = require('./controllers/session');
const reportsController = require('./controllers/reports');
const usersController = require('./controllers/users');

app.use("/ingredients", ingredientsController);
app.use("/menu", menuController);
app.use("/orders", ordersController);
app.use("/session", sessionController.router);
app.use("/reports", reportsController);
app.use("/users", usersController);

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


