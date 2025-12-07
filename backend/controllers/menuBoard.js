const express = require('express');
const router = express.Router();
const db = require('../database');
router.get('/', async (req, res) => {
    try{
        const items = await db.menuBoardManager.getAllMenuBoardItems();
        res.json(items.map(item => item.toJSON()));
    } 
    catch (err) {
        res.status(500).json({ error: error.message });
    }
});
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


