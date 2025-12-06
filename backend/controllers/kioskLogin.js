const express = require('express');
const router = express.Router();

// In-memory store for kiosk login sessions.
const kioskSessions = {};

router.get('/status/:sessionId', (req, res, next) => {
    const { sessionId } = req.params;

    // If the session doesn't exist, create it as pending.
    // This happens on the first poll from the kiosk.
    if (!kioskSessions[sessionId]) {
        kioskSessions[sessionId] = { status: 'pending', user: null };
        // Clean up old sessions after a timeout (5 minutes)
        setTimeout(() => {
            delete kioskSessions[sessionId];
        }, 300000);
    }

    const session = kioskSessions[sessionId];

    if (session.status === 'completed') {
        // The mobile device has authenticated.
        // Check if employee is active (on_staff must be true)
        if (session.user.on_staff !== true) {
            delete kioskSessions[sessionId];
            return res.json({ status: 'denied', message: 'Your account is inactive. Please contact a manager.' });
        }
        
        // Log the user in on the kiosk's session.
        req.login(session.user, (err) => {
            if (err) { return next(err); }

            delete kioskSessions[sessionId];
            
            return res.json({ status: 'completed', user: session.user });
        });
    } else {
        // The session is still pending.
        res.json({ status: 'pending' });
    }
});

router.get('/authenticate/:sessionId', (req, res) => {
    const { sessionId } = req.params;

    if (!req.user) {
        // Redirect to the main login page if the user isn't logged in on their device.
        // Pass the session ID so we can come back to this after login.
        return res.redirect(`/login?redirect=/api/kiosk-login/authenticate/${sessionId}`);
    }

    // Check if employee is active (on_staff must be true)
    if (req.user.on_staff!==true) {
        return res.send('<div style="font-family: sans-serif; text-align: center; padding-top: 50px;"><h1>Access Denied</h1><p>Your account is inactive. Please contact a manager.</p></div>');
    }

    // If the session ID is valid and pending, update its status and store user data.
    if (kioskSessions[sessionId] && kioskSessions[sessionId].status === 'pending') {
        kioskSessions[sessionId].status = 'completed'; // Mark as completed
        kioskSessions[sessionId].user = req.user; // Store the authenticated user object

        // TODO: React page?
        return res.send('<div style="font-family: sans-serif; text-align: center; padding-top: 50px;"><h1>Sign-in successful!</h1><p>You can now close this window.</p></div>');
    }

    // TODO: React page?
    res.status(404).send('<div style="font-family: sans-serif; text-align: center; padding-top: 50px;"><h1>Session not found or expired.</h1><p>Please try generating a new QR code on the kiosk.</p></div>');
});

module.exports = router;
