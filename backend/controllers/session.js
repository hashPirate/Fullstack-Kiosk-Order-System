const session = require('express-session');
const express = require('express');
const router = express.Router();
const db = require('../database');

const sessionMiddleware = session({
    secret: 'very-secret-key', // TODO: use a better secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // TODO: set to true in production with HTTPS
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await db.posUserManager.getUser(username);
    if (user && user.passwordMatches(password)) {
        req.session.user = user;
        res.json({ success: true, user });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

router.get('/current-user', (req, res) => {
    res.json(req.session.user || null);
});

module.exports = { sessionMiddleware, router };
