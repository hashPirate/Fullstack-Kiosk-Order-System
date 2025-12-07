const session = require('express-session');
const express = require('express');
const router = express.Router();
const db = require('../database');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const sessionMiddleware = session({
    secret: 'very-secret-key', // TODO: use a better secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // TODO: set to true in production with HTTPS
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/session/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        const user = await db.userManager.findOrCreateFromGoogleProfile(profile, email);
        return cb(null, user);
    } catch (err) {
        return cb(err);
    }
  }
));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        // This returns what deserializeUser takes in as userPayload
        cb(null, { userId: user.getUserId() });
    });
});
  
passport.deserializeUser(async function(userPayload, cb) {
    try {
        const user = await db.userManager.getUserById(userPayload.userId);
        return cb(null, user);
    } catch (err) {
        return cb(err);
    }
});

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    const user = await db.userManager.getUser(username);
    if (user && user.passwordMatches(password)) {
        //Check if employee is active (on_staff must be true)
        if (user.on_staff!==true) {
            return res.status(403).json({ success: false, message: 'Your account is inactive. Please contact a manager.' });
        }
        req.login(user, (err) => {
            if (err) { return next(err); }
            return res.json({ success: true, user });
        });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

router.get('/auth/google', (req, res, next) => {
    const redirect = req.query.redirect || '/';
    const state = Buffer.from(JSON.stringify({ redirect })).toString('base64');
    passport.authenticate('google', { scope: ['profile', 'email'], state })(req, res, next);
  });

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login?error=oauth' }),
  function(req, res) {
    const state = JSON.parse(Buffer.from(req.query.state, 'base64').toString());
    const redirectPath = state.redirect || '/';
    res.redirect(redirectPath);
  });

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

router.get('/current-user', (req, res) => {
    res.json(req.user || null);
});

module.exports = { sessionMiddleware, router };
