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

router.delete('/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.menuManager.archiveMenuItemById(id);
        res.json({ success: true });
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
 * Route to add a part to a menu item.
 * @name post/items/:id/parts
 * @function
 * @param {string} id - The ID of the menu item.
 * @param {string} partId - The ID of the menu part to add.
 */
router.post('/items/:id/parts', async (req, res) => {
    try {
        const { id } = req.params;
        const { partId } = req.body;
        const menuItem = await db.menuManager.getMenuItemById(id);
        const menuPart = await db.menuManager.getMenuPartById(partId);

        if (!menuItem || !menuPart) {
            return res.status(404).json({ error: 'Menu item or part not found' });
        }

        await db.menuManager.addMenuPartToMenuItem(menuItem, menuPart);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to remove a part from a menu item.
 * @name delete/items/:id/parts/:partId
 * @function
 * @param {string} id - The ID of the menu item.
 * @param {string} partId - The ID of the menu part to remove.
 */
router.delete('/items/:id/parts/:partId', async (req, res) => {
    try {
        const { id, partId } = req.params;
        const menuItem = await db.menuManager.getMenuItemById(id);
        const menuPart = await db.menuManager.getMenuPartById(partId);

        if (!menuItem || !menuPart) {
            return res.status(404).json({ error: 'Menu item or part not found' });
        }

        await db.menuManager.removeMenuPartFromMenuItem(menuItem, menuPart);
        res.json({ success: true });
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
 * @param {string} image_name - The image name of the new menu item.
 */
router.post('/items', async (req, res) => {
    try {
        const { item_name, price, for_sale, image_name } = req.body;
        const item = await db.menuManager.createMenuItem(item_name, price, for_sale, image_name);
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
 * @param {string} image_name - The new image name for the menu item.
 */
router.put('/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { item_name, price, for_sale, image_name } = req.body;
        const menuItem = await db.menuManager.getMenuItemById(id);
        await db.menuManager.updateMenuItem(menuItem, item_name, price, for_sale, image_name);
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
 * @param {string} image_name - The image name of the new menu part.
 */
router.post('/parts', async (req, res) => {
    try {
        const { part_name, price, for_sale, image_name } = req.body;
        const part = await db.menuManager.createMenuPart(part_name, price, for_sale, image_name);
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
 * @param {string} image_name - The new image name for the menu part.
 */
router.put('/parts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { part_name, price, for_sale, image_name } = req.body;

        if ("ingredients" in req.body) {
            console.log(req.body.ingredients);
            // expecting a map of ingredient_id to quantity
            const { ingredients } = req.body;
            const menuPart = await db.menuManager.getMenuPartById(id);
            const ingredientQuantityMap = new Map();
            for (const [ingredientId, quantity] of Object.entries(ingredients)) {
                const ingredient = await db.ingredientManager.getIngredientById(Number(ingredientId));
                ingredientQuantityMap.set(ingredient, quantity);
            }
            await db.menuManager.updateIngredientToMenuPartList(menuPart, ingredientQuantityMap);
        }

        const menuPart = await db.menuManager.getMenuPartById(id);
        await db.menuManager.updateMenuPart(menuPart, part_name, price, for_sale, image_name);
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

// [Donnell]
router.delete('/parts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.menuManager.archiveMenuPartById(id);
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
