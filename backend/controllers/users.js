const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', async (req, res) => {
    try {
        const users = await db.posUserManager.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const user = await db.posUserManager.getUser(username);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await db.posUserManager.createUser(username, password);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const user = await db.posUserManager.getUser(username);
        await db.posUserManager.deleteUser(user);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:username/password', async (req, res) => {
    try {
        const { username } = req.params;
        const { password } = req.body;
        const user = await db.posUserManager.getUser(username);
        await db.posUserManager.setPassword(user, password);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:username/username', async (req, res) => {
    try {
        const { username } = req.params;
        const { newUsername } = req.body;
        const user = await db.posUserManager.getUser(username);
        await db.posUserManager.setUsername(user, newUsername);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:username/manager', async (req, res) => {
    try {
        const { username } = req.params;
        const { isManager } = req.body;
        const user = await db.posUserManager.getUser(username);
        await db.posUserManager.setManager(user, isManager);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:username/on-staff', async (req, res) => {
    try {
        const { username } = req.params;
        const { onStaff } = req.body;
        const user = await db.posUserManager.getUser(username);
        await db.posUserManager.setOnStaff(user, onStaff);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
