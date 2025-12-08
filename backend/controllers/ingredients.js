/**
 * @module controllers/ingredients
 */
const express = require('express');
const router = express.Router();
const db = require('../database');

/**
 * Route to get a paginated list of ingredients.
 * @name get/
 * @function
 * @param {number} [limit] - The maximum number of ingredients to return.
 * @param {number} [offset] - The number of ingredients to skip.
 */
router.get('/', async (req, res) => {
    try {
        const { limit, offset } = req.query;
        const ingredients = await db.ingredientManager.getIngredients(limit, offset);
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to get all ingredients.
 * @name get/all
 * @function
 */
router.get('/all', async (req, res) => {
    try {
        const ingredients = await db.ingredientManager.getAllIngredients();
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to get all in-stock ingredients.
 * @name get/in-stock
 * @function
 */
router.get('/in-stock', async (req, res) => {
    try {
        const ingredients = await db.ingredientManager.getInStockIngredients();
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to get all low-stock ingredients.
 * @name get/low-stock
 * @function
 */
router.get('/low-stock', async (req, res) => {
    try {
        const ingredients = await db.ingredientManager.getLowStockIngredients();
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to get all out-of-stock ingredients.
 * @name get/out-of-stock
 * @function
 */
router.get('/out-of-stock', async (req, res) => {
    try {
        const ingredients = await db.ingredientManager.getOutOfStockIngredients();
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to get ingredients that are below their alert threshold.
 * @name get/needing-restock
 * @function
 */
router.get('/needing-restock', async (req, res) => {
    try {
        const ingredients = await db.ingredientManager.getIngredientsNeedingRestock();
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to get a specific ingredient by its ID.
 * @name get/:id
 * @function
 * @param {string} id - The ID of the ingredient.
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const ingredient = await db.ingredientManager.getIngredientById(id);
        res.json(ingredient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to create a new ingredient.
 * @name post/
 * @function
 * @param {string} name - The name of the ingredient.
 * @param {number} current_quantity - The current stock quantity.
 * @param {string} quantity_unit - The unit of measurement for the quantity.
 * @param {number} alert_threshold - The quantity threshold for low-stock alerts.
 */
router.post('/', async (req, res) => {
    try {
        const { name, current_quantity, quantity_unit, alert_threshold } = req.body;
        const ingredient = await db.ingredientManager.createIngredient(name, current_quantity, quantity_unit, alert_threshold);
        res.json(ingredient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to update the name of an ingredient.
 * @name put/:id/name
 * @function
 * @param {string} id - The ID of the ingredient.
 * @param {string} newName - The new name for the ingredient.
 */
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

/**
 * Route to update the quantity unit of an ingredient.
 * @name put/:id/quantity-unit
 * @function
 * @param {string} id - The ID of the ingredient.
 * @param {string} newUnit - The new quantity unit for the ingredient.
 */
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

/**
 * Route to set the quantity of an ingredient.
 * @name put/:id/quantity
 * @function
 * @param {string} id - The ID of the ingredient.
 * @param {number} newQuantity - The new quantity for the ingredient.
 */
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

/**
 * Route to change the quantity of an ingredient by a delta.
 * @name put/:id/change-quantity
 * @function
 * @param {string} id - The ID of the ingredient.
 * @param {number} delta - The amount to change the quantity by (can be negative).
 */
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

/**
 * Route to update an ingredient's details.
 * @name put/:id
 * @function
 * @param {string} id - The ID of the ingredient.
 * @param {string} name - The new name for the ingredient.
 * @param {number} current_quantity - The new current quantity.
 * @param {string} quantity_unit - The new quantity unit.
 * @param {number} alert_threshold - The new alert threshold.
 */
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
