const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', async (req, res) => {
    try {
        const { limit, offset } = req.query;
        const orders = await db.orderManager.getLatestOrders(limit, offset);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/after-date', async (req, res) => {
    try {
        const { limit, date } = req.query;
        const orders = await db.orderManager.getLatestOrdersAfterDateAndFinal(limit, date);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/active', async (req, res) => {
    try {
        const { limit, offset } = req.query;
        const orders = await db.orderManager.getActiveOrders(limit, offset);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/past', async (req, res) => {
    try {
        const { limit, offset } = req.query;
        const orders = await db.orderManager.getPastOrders(limit, offset);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const order = await db.orderManager.createOrder();
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id/items', async (req, res) => {
    try {
        const { id } = req.params;
        const order = await db.orderManager.getOrderById(id);
        const items = await db.orderManager.getOrderItems(order);
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/items', async (req, res) => {
    try {
        const { id } = req.params;
        const { menu_item_id, quantity } = req.body;
        const order = await db.orderManager.getOrderById(id);
        const menuItem = await db.menuManager.getMenuItemById(menu_item_id);
        const item = await db.orderManager.createOrderItem(order, menuItem, quantity);
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { menu_item_id, quantity } = req.body;
        const orderItem = await db.orderManager.getOrderItemById(id);
        const menuItem = await db.menuManager.getMenuItemById(menu_item_id);
        await db.orderManager.updateOrderItemMenuItem(orderItem, menuItem, quantity);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/items/:id/quantity', async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const orderItem = await db.orderManager.getOrderItemById(id);
        await db.orderManager.updateOrderItemQuantity(orderItem, quantity);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/items/:id/parts', async (req, res) => {
    try {
        const { id } = req.params;
        const { menu_part_id } = req.body;
        const orderItem = await db.orderManager.getOrderItemById(id);
        const menuPart = await db.menuManager.getMenuPartById(menu_part_id);
        await db.orderManager.addMenuPartToOrderItem(orderItem, menuPart);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/items/:id/parts', async (req, res) => {
    try {
        const { id } = req.params;
        const orderItem = await db.orderManager.getOrderItemById(id);
        await db.orderManager.clearMenuPartsForOrderItem(orderItem);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const orderItem = await db.orderManager.getOrderItemById(id);
        await db.orderManager.deleteOrderItem(orderItem);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id/finalize', async (req, res) => {
    try {
        const { id } = req.params;
        const order = await db.orderManager.getOrderById(id);
        await db.orderManager.finalizeOrder(order);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/sales-by-item', async (req, res) => {
    try {
        const { startTime, endTime } = req.query;
        const sales = await db.orderManager.getSalesByItem(startTime, endTime);
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/sales-per-hour', async (req, res) => {
    try {
        const { day } = req.query;
        const sales = await db.orderManager.getSalesPerHour(day);
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
