const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/items', async (req, res) => {
    try {
        const items = await db.menuManager.getAllMenuItems();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const item = await db.menuManager.getMenuItemById(id);
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/items', async (req, res) => {
    try {
        const { item_name, price, for_sale } = req.body;
        const item = await db.menuManager.createMenuItem(item_name, price, for_sale);
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { item_name, price, for_sale } = req.body;
        const menuItem = await db.menuManager.getMenuItemById(id);
        await db.menuManager.updateMenuItem(menuItem, item_name, price, for_sale);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/parts', async (req, res) => {
    try {
        const parts = await db.menuManager.getAllMenuParts();
        res.json(parts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/parts', async (req, res) => {
    try {
        const { part_name, price, for_sale } = req.body;
        const part = await db.menuManager.createMenuPart(part_name, price, for_sale);
        res.json(part);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/parts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { part_name, price, for_sale } = req.body;
        const menuPart = await db.menuManager.getMenuPartById(id);
        await db.menuManager.updateMenuPart(menuPart, part_name, price, for_sale);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/parts/:id/ingredients', async (req, res) => {
    try {
        const { id } = req.params;
        const menuPart = await db.menuManager.getMenuPartById(id);
        const ingredients = await db.menuManager.getIngredientsFromMenuPart(menuPart);
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/parts/:id/ingredients', async (req, res) => {
    try {
        const { id } = req.params;
        const { ingredients } = req.body; // expecting a map of ingredient id to quantity
        const menuPart = await db.menuManager.getMenuPartById(id);
        const ingredientQuantityMap = new Map();
        for (const [ingredientId, quantity] of Object.entries(ingredients)) {
            const ingredient = await db.ingredientManager.getIngredientById(ingredientId);
            ingredientQuantityMap.set(ingredient, quantity);
        }
        await db.menuManager.updateIngredientToMenuPartList(menuPart, ingredientQuantityMap);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
