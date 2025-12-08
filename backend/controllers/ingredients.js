const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', async (req, res) => {
    try {
        const { limit, offset } = req.query;
        const ingredients = await db.ingredientManager.getIngredients(limit, offset);
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const ingredients = await db.ingredientManager.getAllIngredients();
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/in-stock', async (req, res) => {
    try {
        const ingredients = await db.ingredientManager.getInStockIngredients();
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/low-stock', async (req, res) => {
    try {
        const ingredients = await db.ingredientManager.getLowStockIngredients();
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/out-of-stock', async (req, res) => {
    try {
        const ingredients = await db.ingredientManager.getOutOfStockIngredients();
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/needing-restock', async (req, res) => {
    try {
        const ingredients = await db.ingredientManager.getIngredientsNeedingRestock();
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const ingredient = await db.ingredientManager.getIngredientById(id);
        res.json(ingredient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, current_quantity, quantity_unit, alert_threshold } = req.body;
        const ingredient = await db.ingredientManager.createIngredient(name, current_quantity, quantity_unit, alert_threshold);
        res.json(ingredient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id/name', async (req, res) => {
    try {
        const { id } = req.params;
        const { newName } = req.body;
        const ingredient = await db.ingredientManager.getIngredientById(id);
        await db.ingredientManager.setName(ingredient, newName);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id/quantity-unit', async (req, res) => {
    try {
        const { id } = req.params;
        const { newUnit } = req.body;
        const ingredient = await db.ingredientManager.getIngredientById(id);
        await db.ingredientManager.setQuantityUnit(ingredient, newUnit);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id/quantity', async (req, res) => {
    try {
        const { id } = req.params;
        const { newQuantity } = req.body;
        const ingredient = await db.ingredientManager.getIngredientById(id);
        await db.ingredientManager.setQuantity(ingredient, newQuantity);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id/change-quantity', async (req, res) => {
    try {
        const { id } = req.params;
        const { delta } = req.body;
        const ingredient = await db.ingredientManager.getIngredientById(id);
        await db.ingredientManager.changeQuantity(ingredient, delta);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, current_quantity, quantity_unit, alert_threshold } = req.body;
        const ingredient = await db.ingredientManager.getIngredientById(id);
        await db.ingredientManager.updateIngredient(ingredient, name, current_quantity, quantity_unit, alert_threshold);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const ingredient = await db.ingredientManager.getIngredientById(id);
        await db.ingredientManager.deleteIngredient(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
