/**
 * @module controllers/orders
 */
const express = require('express');
const router = express.Router();
const db = require('../database');

/**
 * Route to get the latest orders.
 * @name get/
 * @function
 * @param {number} [limit] - The maximum number of orders to return.
 * @param {number} [offset] - The number of orders to skip.
 */
router.get('/', async (req, res) => {
    try {
        const { limit, offset } = req.query;
        const orders = await db.orderManager.getLatestOrders(limit, offset);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to get the latest finalized orders after a specific date.
 * @name get/after-date
 * @function
 * @param {string} date - The start date in ISO format.
 * @param {number} [limit] - The maximum number of orders to return.
 */
router.get('/after-date', async (req, res) => {
    try {
        const { limit, date } = req.query;
        const orders = await db.orderManager.getLatestOrdersAfterDateAndFinal(limit, date);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to get active (not finalized) orders.
 * @name get/active
 * @function
 * @param {number} [limit] - The maximum number of orders to return.
 * @param {number} [offset] - The number of orders to skip.
 */
router.get('/active', async (req, res) => {
    try {
        const { limit, offset } = req.query;
        const orders = await db.orderManager.getActiveOrders(limit, offset);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to get all uncooked orders.
 * @name get/uncooked
 * @function
 */
router.get('/uncooked', async (req, res) => {
    try {
        const orders = await db.orderManager.getUncookedOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to get the latest cooked orders.
 * @name get/cooked
 * @function
 * @param {number} [limit] - The maximum number of orders to return.
 * @param {number} [offset] - The number of orders to skip.
 */
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

/**
 * Route to get the count of cooked orders.
 * @name get/cooked/count
 * @function
 */
router.get('/cooked/count', async (req, res) => {
    try {
        const cookedCount = await db.orderManager.getNumCookedOrders();
        res.json({ count: cookedCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to set the cooked status of an order.
 * @name put/:id/set-cooked
 * @function
 * @param {string} id - The ID of the order.
 * @param {boolean} is_cooked - The new cooked status.
 */
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

/**
 * Route to get past orders.
 * @name get/past
 * @function
 * @param {number} [limit] - The maximum number of orders to return.
 * @param {number} [offset] - The number of orders to skip.
 */
router.get('/past', async (req, res) => {
    try {
        const { limit, offset } = req.query;
        const orders = await db.orderManager.getPastOrders(limit, offset);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to get the orders for the currently authenticated user.
 * @name get/my-orders
 * @function
 * @param {number} [limit] - The maximum number of orders to return.
 * @param {number} [offset] - The number of orders to skip.
 */
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

/**
 * Route to create a new order.
 * @name post/
 * @function
 */
router.post('/', async (req, res) => {
    try {
        const order = await db.orderManager.createOrder();
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to get the items for a specific order.
 * @name get/:id/items
 * @function
 * @param {string} id - The ID of the order.
 */
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

/**
 * Route to add an item to an order.
 * @name post/:id/items
 * @function
 * @param {string} id - The ID of the order.
 * @param {string} menu_item_id - The ID of the menu item to add.
 * @param {number} quantity - The quantity of the menu item.
 */
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

/**
 * Route to update an order item.
 * @name put/items/:id
 * @function
 * @param {string} id - The ID of the order item.
 * @param {string} menu_item_id - The new menu item ID.
 * @param {number} quantity - The new quantity.
 */
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

/**
 * Route to update the quantity of an order item.
 * @name put/items/:id/quantity
 * @function
 * @param {string} id - The ID of the order item.
 * @param {number} quantity - The new quantity.
 */
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

/**
 * Route to add a menu part to an order item.
 * @name post/items/:id/parts
 * @function
 * @param {string} id - The ID of the order item.
 * @param {string} menu_part_id - The ID of the menu part to add.
 */
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
/**
 * Route to get the menu parts for an order item.
 * @name get/items/:id/parts
 * @function
 * @param {string} id - The ID of the order item.
 */
router.get('/items/:id/parts', async (req, res) => {
    try {
        const { id } = req.params;
        const menuParts = await db.orderManager.getMenuPartsFromOrderItem(id)
        res.json(menuParts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to clear all menu parts from an order item.
 * @name delete/items/:id/parts
 * @function
 * @param {string} id - The ID of the order item.
 */
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

/**
 * Route to delete an order item.
 * @name delete/items/:id
 * @function
 * @param {string} id - The ID of the order item to delete.
 */
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

/**
 * Route to finalize an order.
 * @name put/:id/finalize
 * @function
 * @param {string} id - The ID of the order to finalize.
 */
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

/**
 * Route to get sales data by item within a time range.
 * @name get/sales-by-item
 * @function
 * @param {string} startTime - The start of the time range in ISO format.
 * @param {string} endTime - The end of the time range in ISO format.
 */
router.get('/sales-by-item', async (req, res) => {
    try {
        const { startTime, endTime } = req.query;
        const sales = await db.orderManager.getSalesByItem(startTime, endTime);
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to get sales data per hour for a specific day.
 * @name get/sales-per-hour
 * @function
 * @param {string} day - The day in 'YYYY-MM-DD' format.
 */
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
