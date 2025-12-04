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

router.get('/uncooked', async (req, res) => {
    try {
        const orders = await db.orderManager.getUncookedOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/cooked', async (req, res) => {
    try {
        const limit = Number.parseInt(req.query.limit);
        const offset = Number.parseInt(req.query.offset);
        const orders = await db.orderManager.getLatestCookedOrders(limit, offset);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/cooked/count', async (req, res) => {
    try {
        const cookedCount = await db.orderManager.getNumCookedOrders();
        res.json({ count: cookedCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id/set-cooked', async (req, res) => {
    try {
        const { id } = req.params;
        const { is_cooked } = req.body;
        db.orderManager.setIsCooked(await db.orderManager.getOrderById(id), is_cooked);
        res.json({ success: true });
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

router.get('/my-orders', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    
    try {
        const { limit, offset } = req.query;
        var orders = await db.orderManager.getOrdersForUserId(req.user.getUserId(), limit, offset);

        var ordersWithItems = []
        
        // Fill orders with order items
        for (var order of orders) {
            const orderItems = await db.orderManager.getOrderItems(order);
            order = order.toJSON();
            order.order_items = orderItems;

            // Add menu item info and parts for each order item
            for (let i = 0; i < order.order_items.length; i++) {
                const menuItem = await order.order_items[i].getMenuItem();
                const menuParts = await db.orderManager.getMenuPartsFromOrderItem(order.order_items[i].getOrderItemID());
                order.order_items[i] = order.order_items[i].toJSON();
                order.order_items[i].menu_item = menuItem;
                order.order_items[i].menu_parts = menuParts;
            }

            ordersWithItems.push(order);
        }
        
        res.json(ordersWithItems);
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

// [Donnell]: made this to get menu parts for an order item.
router.get('/items/:id/parts', async (req, res) => {
    try {
        const { id } = req.params;
        const menuParts = await db.orderManager.getMenuPartsFromOrderItem(id)
        res.json(menuParts);
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
        const userId = req.user ? req.user.getUserId() : null;
        await db.orderManager.finalizeOrder(order, userId);
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
