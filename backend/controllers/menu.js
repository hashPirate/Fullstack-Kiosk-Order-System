/**
 * @module controllers/menu
 */
const express = require('express');
const router = express.Router();
const db = require('../database');

/**
 * Route to get all menu items.
 * @name get/items
 * @function
 */
router.get('/items', async (req, res) => {
    try {
        const items = await db.menuManager.getAllMenuItems();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to get the full menu with items and their associated parts, including dietary restrictions.
 * @name get/full-menu
 * @function
 */
router.get('/full-menu', async (req, res) => {
    try {
        const menuItems = await db.menuManager.getAllMenuItems();
        const items = [];
        for (const menuItem of menuItems) {
            const parts = await db.menuManager.getMenuPartsForMenuItem(menuItem);
            const partsWithRestrictions = await Promise.all(parts.map(async (part) => {
                const restrictions = await part.getDietaryRestrictions();
                // Add in the dietary restrictions
                return { ...part.toJSON(), dietary_restrictions: restrictions.map(r => r.toJSON()) };
            }));

            items.push({ ...menuItem.toJSON(), applicable_parts: partsWithRestrictions });
        }
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to get a specific menu item by its ID.
 * @name get/items/:id
 * @function
 * @param {string} id - The ID of the menu item.
 */
router.get('/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const item = await db.menuManager.getMenuItemById(id);
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to get all parts for a specific menu item, including dietary restrictions.
 * @name get/items/:id/parts
 * @function
 * @param {string} id - The ID of the menu item.
 */
router.get('/items/:id/parts', async (req, res) => {
    try {
        const { id } = req.params;
        const menuItem = await db.menuManager.getMenuItemById(id);
        const parts = await db.menuManager.getMenuPartsForMenuItem(menuItem);
        const partsWithRestrictions = await Promise.all(parts.map(async (part) => {
            const restrictions = await part.getDietaryRestrictions();
            // Add in the dietary restrictions
            return { ...part.toJSON(), dietary_restrictions: restrictions.map(r => r.dietary_restriction_name) };
        }));
        res.json(partsWithRestrictions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to create a new menu item.
 * @name post/items
 * @function
 * @param {string} item_name - The name of the new menu item.
 * @param {number} price - The price of the new menu item.
 * @param {boolean} for_sale - Whether the item is for sale.
 */
router.post('/items', async (req, res) => {
    try {
        const { item_name, price, for_sale } = req.body;
        const item = await db.menuManager.createMenuItem(item_name, price, for_sale);
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to update an existing menu item.
 * @name put/items/:id
 * @function
 * @param {string} id - The ID of the menu item to update.
 * @param {string} item_name - The new name of the menu item.
 * @param {number} price - The new price of the menu item.
 * @param {boolean} for_sale - The new for_sale status.
 */
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

/**
 * Route to get all menu parts.
 * @name get/parts
 * @function
 */
router.get('/parts', async (req, res) => {
    try {
        const parts = await db.menuManager.getAllMenuParts();
        res.json(parts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to create a new menu part.
 * @name post/parts
 * @function
 * @param {string} part_name - The name of the new menu part.
 * @param {number} price - The price of the new menu part.
 * @param {boolean} for_sale - Whether the part is for sale.
 */
router.post('/parts', async (req, res) => {
    try {
        const { part_name, price, for_sale } = req.body;
        const part = await db.menuManager.createMenuPart(part_name, price, for_sale);
        res.json(part);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to update an existing menu part.
 * @name put/parts/:id
 * @function
 * @param {string} id - The ID of the menu part to update.
 * @param {string} part_name - The new name of the menu part.
 * @param {number} price - The new price of the menu part.
 * @param {boolean} for_sale - The new for_sale status.
 */
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

/**
 * Route to get all ingredients for a specific menu part.
 * @name get/parts/:id/ingredients
 * @function
 * @param {string} id - The ID of the menu part.
 */
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

/**
 * Route to update the ingredients for a menu part.
 * @name put/parts/:id/ingredients
 * @function
 * @param {string} id - The ID of the menu part to update.
 * @param {Object<string, number>} ingredients - A map of ingredient IDs to their quantities.
 */
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
