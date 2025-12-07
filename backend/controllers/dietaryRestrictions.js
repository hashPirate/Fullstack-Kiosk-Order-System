const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', async (req, res) => {
    try {
        const restrictions = await db.dietaryRestrictionManager.getAll();
        res.json(restrictions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        const restriction = await db.dietaryRestrictionManager.create(name);
        res.status(201).json(restriction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/my-restrictions', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    try {
        const restrictions = await db.userManager.getDietaryRestrictions(req.user);
        res.json(restrictions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/my-restrictions', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    try {
        const { restrictionId } = req.body;
        await db.userManager.addDietaryRestriction(req.user, restrictionId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/my-restrictions/:restrictionId', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    try {
        const { restrictionId } = req.params;
        await db.userManager.removeDietaryRestriction(req.user, restrictionId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/user/:username', async (req, res) => {
    try {
        const user = await db.userManager.getUser(req.params.username);
        if (!user) return res.status(404).json({ error: 'User not found' });
        const restrictions = await user.getDietaryRestrictions();
        res.json(restrictions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/user/:username/:restrictionId', async (req, res) => {
    try {
        const user = await db.userManager.getUser(req.params.username);
        if (!user) return res.status(404).json({ error: 'User not found' });
        const restriction = await db.dietaryRestrictionManager.getById(req.params.restrictionId);
        if (!restriction) return res.status(404).json({ error: 'Dietary restriction not found' });
        
        await db.userManager.addDietaryRestriction(user, restriction);
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/user/:username/:restrictionId', async (req, res) => {
    try {
        const user = await db.userManager.getUser(req.params.username);
        if (!user) return res.status(404).json({ error: 'User not found' });
        const restriction = await db.dietaryRestrictionManager.getById(req.params.restrictionId);
        if (!restriction) return res.status(404).json({ error: 'Dietary restriction not found' });

        await db.userManager.removeDietaryRestriction(user, restriction);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/ingredient/:ingredientId/:restrictionId', async (req, res) => {
    try {
        const ingredient = await db.ingredientManager.getIngredientById(req.params.ingredientId);
        if (!ingredient) return res.status(404).json({ error: 'Ingredient not found' });
        const restriction = await db.dietaryRestrictionManager.getById(req.params.restrictionId);
        if (!restriction) return res.status(404).json({ error: 'Dietary restriction not found' });

        await db.ingredientManager.addDietaryRestriction(ingredient, restriction);
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/ingredient/:ingredientId', async (req, res) => {
    try {
        const ingredient = await db.ingredientManager.getIngredientById(req.params.ingredientId);
        if (!ingredient) return res.status(404).json({ error: 'Ingredient not found' });
        const restrictions = await db.ingredientManager.getDietaryRestrictions(ingredient);
        res.json(restrictions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/ingredient/:ingredientId/:restrictionId', async (req, res) => {
    try {
        const ingredient = await db.ingredientManager.getIngredientById(req.params.ingredientId);
        if (!ingredient) return res.status(404).json({ error: 'Ingredient not found' });
        const restriction = await db.dietaryRestrictionManager.getById(req.params.restrictionId);
        if (!restriction) return res.status(404).json({ error: 'Dietary restriction not found' });

        await db.ingredientManager.removeDietaryRestriction(ingredient, restriction);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.dietaryRestrictionManager.delete(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;