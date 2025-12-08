/**
 * @module controllers/users
 */
const express = require('express');
const router = express.Router();
const db = require('../database');

/**
 * Route to get all users.
 * @name get/
 * @function
 */
router.get('/', async (req, res) => {
    try {
        const users = await db.userManager.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to get a specific user by username.
 * @name get/:username
 * @function
 * @param {string} username - The username of the user to retrieve.
 */
router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const user = await db.userManager.getUser(username);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to create a new user.
 * @name post/
 * @function
 * @param {string} username - The username for the new user.
 * @param {string} password - The password for the new user.
 */
router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await db.userManager.createUser(username, password);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to delete a user.
 * @name delete/:username
 * @function
 * @param {string} username - The username of the user to delete.
 */
router.delete('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const user = await db.userManager.getUser(username);
        await db.userManager.deleteUser(user);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to update a user's password.
 * @name put/:username/password
 * @function
 * @param {string} username - The username of the user to update.
 * @param {string} password - The new password.
 */
router.put('/:username/password', async (req, res) => {
    try {
        const { username } = req.params;
        const { password } = req.body;
        const user = await db.userManager.getUser(username);
        await db.userManager.setPassword(user, password);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to update a user's username.
 * @name put/:username/username
 * @function
 * @param {string} username - The current username of the user.
 * @param {string} newUsername - The new username.
 */
router.put('/:username/username', async (req, res) => {
    try {
        const { username } = req.params;
        const { newUsername } = req.body;
        const user = await db.userManager.getUser(username);
        await db.userManager.setUsername(user, newUsername);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to set a user's cashier role.
 * @name put/:username/cashier
 * @function
 * @param {string} username - The username of the user.
 * @param {boolean} isCashier - The new cashier status.
 */
router.put('/:username/cashier', async (req, res) => {
    try {
        const { username } = req.params;
        const { isCashier } = req.body;
        const user = await db.userManager.getUser(username);
        await db.userManager.setCashier(user, isCashier);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to set a user's manager role.
 * @name put/:username/manager
 * @function
 * @param {string} username - The username of the user.
 * @param {boolean} isManager - The new manager status.
 */
router.put('/:username/manager', async (req, res) => {
    try {
        const { username } = req.params;
        const { isManager } = req.body;
        const user = await db.userManager.getUser(username);
        await db.userManager.setManager(user, isManager);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to set a user's on-staff status.
 * @name put/:username/on-staff
 * @function
 * @param {string} username - The username of the user.
 * @param {boolean} onStaff - The new on-staff status.
 */
router.put('/:username/on-staff', async (req, res) => {
    try {
        const { username } = req.params;
        const { onStaff } = req.body;
        const user = await db.userManager.getUser(username);
        await db.userManager.setOnStaff(user, onStaff);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route for the authenticated user to update their language preference.
 * @name put/language
 * @function
 * @param {string} language - The new language preference code (e.g., 'en', 'es').
 */
router.put('/language', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        const { language } = req.body;
        await db.userManager.setLanguage(req.user.getUserId(), language);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
