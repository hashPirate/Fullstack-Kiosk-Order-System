/**
 * @module controllers/menuBoard
 */
const express = require('express');
const router = express.Router();
const db = require('../database');
/**
 * Route to get all menu board items.
 * @name get/
 * @function
 */
router.get('/', async (req, res) => {
    try{
        const items = await db.menuBoardManager.getAllMenuBoardItems();
        res.json(items.map(item => item.toJSON()));
    } 
    catch (err) {
        res.status(500).json({ error: error.message });
    }
});
/**
 * Route to create a new menu board item.
 * @name post/
 * @function
 * @param {string} section - The section of the menu board.
 * @param {string} item_name - The name of the item.
 * @param {number} [calories] - The calorie count.
 * @param {string} [calorie_range] - The calorie range as a string.
 * @param {number} [price] - The price of the item.
 * @param {string} [description] - A description of the item.
 */
router.post('/', async (req, res) =>{
    const { section, item_name, calories, calorie_range, price, description } = req.body;
    if (!section || !item_name) {
        return res.status(400).json({ error: 'section and item_name are required' });
    }
    try {
        const newMenuItem = await db.menuBoardManager.createMenuBoardItem({section, item_name, calories,calorie_range, price,description,});
        res.json(newMenuItem.toJSON());
    } 
    catch (err) {
        res.status(500).json({ error: error.message });
    }
});
/**
 * Route to update a menu board item.
 * @name put/:id
 * @function
 * @param {string} id - The ID of the menu board item to update.
 * @param {string} [item_name] - The new name of the item.
 * @param {number} [calories] - The new calorie count.
 * @param {string} [calorie_range] - The new calorie range.
 * @param {number} [price] - The new price.
 * @param {string} [description] - The new description.
 */
router.put('/:id', async (req, res) =>{
    const { id } = req.params;
    const { item_name, calories, calorie_range, price, description} = req.body;
    try{
        const changesMade = await db.menuBoardManager.updateMenuBoardItem(id, {item_name, calories, calorie_range, price, description,});
        if (!changesMade) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.json(changesMade.toJSON());
    } 
    catch (err) {
        res.status(500).json({ error: error.message });
    }
});
/**
 * Route to delete a menu board item.
 * @name delete/:id
 * @function
 * @param {string} id - The ID of the menu board item to delete.
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try{
        const itemInMenu= await db.menuBoardManager.deleteMenuBoardItem(id);
        if (!itemInMenu){
            return res.status(404).json({ error: 'Not found' });
        }
        res.json({ success: true });
    } 
    catch (err) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
