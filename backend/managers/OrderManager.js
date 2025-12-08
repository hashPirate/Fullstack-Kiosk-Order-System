/**
 * @module manager
 */
const DbModelManager = require('./DbModelManager');
const Order = require('../model/Order');
const OrderItem = require('../model/OrderItem');
const MenuPart = require('../model/MenuPart');
const ItemSalesReport = require('../model/ItemSalesReport');
const HourlySales = require('../model/HourlySales');

/**
 * Manages orders and order items in the database.
 * @class OrderManager
 * @extends DbModelManager
 * @param {object} db - The database connection object.
 */
class OrderManager extends DbModelManager {
    constructor(db) {
        super(db);
    }

    /**
     * Retrieves an order item by its ID.
     * @param {number} orderItemId - The ID of the order item.
     * @returns {Promise<OrderItem|null>} The order item object, or null if not found.
     */
    async getOrderItemById(orderItemId) {
        const result = await this.db.query('SELECT * FROM order_items WHERE order_item_id = $1', [orderItemId]);
        if (result.rows.length === 0) {
            return null;
        }
        return new OrderItem(this.db, result.rows[0]);
    }

    /**
     * Retrieves an order by its ID.
     * @param {number} orderId - The ID of the order.
     * @returns {Promise<Order|null>} The order object, or null if not found.
     */
    async getOrderById(orderId) {
        const result = await this.db.query('SELECT * FROM orders WHERE order_id = $1', [orderId]);
        if (result.rows.length === 0) {
            return null;
        }
        return new Order(this.db, result.rows[0]);
    }

    /**
     * Retrieves the latest orders.
     * @param {number} limit - The maximum number of orders to return.
     * @param {number} offset - The number of orders to skip.
     * @returns {Promise<Order[]>} A list of orders.
     */
    async getLatestOrders(limit, offset) {
        const result = await this.db.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
        return result.rows.map(row => new Order(this.db, row));
    }

    // [Donnell]: for Kitchen View
    /**
     * Retrieves the latest cooked orders.
     * @param {number} limit - The maximum number of orders to return.
     * @param {number} offset - The number of orders to skip.
     * @returns {Promise<Order[]>} A list of cooked orders.
     */
    async getLatestCookedOrders(limit, offset) {
        const query = `SELECT * FROM orders
WHERE is_cooked = TRUE
ORDER BY cooked_at DESC NULLS LAST, created_at DESC
LIMIT $1 OFFSET $2;`;
        const result = await this.db.query(query, [limit, offset]);
        return result.rows.map(row => new Order(this.db, row));
    }

    /**
     * Gets the total number of cooked orders.
     * @returns {Promise<number>} The count of cooked orders.
     */
    async getNumCookedOrders() {
        const result = await this.db.query('SELECT COUNT(*) FROM orders WHERE is_cooked = TRUE');
        return result.rows[0].count;    // Only return the actual count.
    }

    // [Donnell]: get all the orders that haven't been cooked yet.
    /**
     * Retrieves all uncooked orders.
     * @returns {Promise<Order[]>} A list of uncooked orders.
     */
    async getUncookedOrders() {
        const result = await this.db.query('SELECT * FROM orders WHERE is_cooked = FALSE ORDER BY created_at');
        return result.rows.map(row => new Order(this.db, row));
    }

    /**
     * Retrieves the latest finalized orders after a specific date.
     * @param {number} limit - The maximum number of orders to return.
     * @param {string} date - The start date.
     * @returns {Promise<Order[]>} A list of orders.
     */
    async getLatestOrdersAfterDateAndFinal(limit, date) {
        const result = await this.db.query('SELECT * FROM orders WHERE created_at::date >= $1 AND is_final = true ORDER BY created_at DESC LIMIT $2', [date, limit]);
        return result.rows.map(row => new Order(this.db, row));
    }

    /**
     * Retrieves orders for a specific user.
     * @param {number} userId - The ID of the user.
     * @param {number} limit - The maximum number of orders to return.
     * @param {number} offset - The number of orders to skip.
     * @returns {Promise<Order[]>} A list of orders.
     */
    async getOrdersForUserId(userId, limit, offset) {
        const result = await this.db.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3', [userId, limit, offset]);
        return result.rows.map(row => new Order(this.db, row));
    }

    /**
     * Retrieves all items for a given order.
     * @param {Order} order - The order.
     * @returns {Promise<OrderItem[]>} A list of order items.
     */
    async getOrderItems(order) {
        const result = await this.db.query('SELECT * FROM order_items WHERE order_id = $1 ORDER BY created_at', [order.getOrderID()]);
        return result.rows.map(row => new OrderItem(this.db, row));
    }

    // [Donnell]: made this to get menu parts for an order item.
    /**
     * Retrieves the menu parts for a specific order item.
     * @param {number} orderItemId - The ID of the order item.
     * @returns {Promise<MenuPart[]>} A list of menu parts.
     */
    async getMenuPartsFromOrderItem(orderItemId) {
        const query = `
        SELECT menu_parts.menu_part_id, part_name, image_name, price, for_sale FROM menu_parts_to_order_items
        INNER JOIN menu_parts ON menu_parts.menu_part_id = menu_parts_to_order_items.menu_part_id
        WHERE order_item_id = $1;`;
        const result = await this.db.query(query, [orderItemId]);
        return result.rows.map(row => new MenuPart(this.db, row));
    }

    /**
     * Creates a new order.
     * @returns {Promise<Order>} The newly created order.
     */
    async createOrder() {
        const result = await this.db.query('INSERT INTO orders (created_at, is_final) VALUES (NOW(), false) RETURNING *');
        return new Order(this.db, result.rows[0]);
    }

    /**
     * Creates a new order item and adds it to an order.
     * @param {Order} order - The order to add the item to.
     * @param {MenuItem} menuItem - The menu item to add.
     * @param {number} quantity - The quantity of the menu item.
     * @returns {Promise<OrderItem>} The newly created order item.
     */
    async createOrderItem(order, menuItem, quantity) {
        await this.ensureNotFinal(order.getOrderID());
        const result = await this.db.query('INSERT INTO order_items (order_id, menu_item_id, created_at, quantity, current_price) VALUES ($1, $2, NOW(), $3, $4) RETURNING *', [order.getOrderID(), menuItem.getMenuItemId(), quantity, menuItem.getPrice()]);
        return new OrderItem(this.db, result.rows[0]);
    }

    /**
     * Updates the menu item and quantity for an order item.
     * @param {OrderItem} orderItem - The order item to update.
     * @param {MenuItem} menuItem - The new menu item.
     * @param {number} quantity - The new quantity.
     */
    async updateOrderItemMenuItem(orderItem, menuItem, quantity) {
        await this.ensureNotFinal(orderItem.getOrderID());
        await this.clearMenuPartsForOrderItem(orderItem);
        await this.db.query('UPDATE order_items SET menu_item_id = $1, quantity = $2, current_price = $3 WHERE order_item_id = $4', [menuItem.getMenuItemId(), quantity, menuItem.getPrice(), orderItem.getOrderItemID()]);
    }

    /**
     * Updates the quantity of an order item.
     * @param {OrderItem} orderItem - The order item to update.
     * @param {number} quantity - The new quantity.
     */
    async updateOrderItemQuantity(orderItem, quantity) {
        await this.ensureNotFinal(orderItem.getOrderID());
        await this.db.query('UPDATE order_items SET quantity = $1 WHERE order_item_id = $2', [quantity, orderItem.getOrderItemID()]);
    }

    /**
     * Adds a menu part to an order item.
     * @param {OrderItem} orderItem - The order item.
     * @param {MenuPart} menuPart - The menu part to add.
     */
    async addMenuPartToOrderItem(orderItem, menuPart) {
        await this.ensureNotFinal(orderItem.getOrderID());
        await this.db.runUpdate('INSERT INTO menu_parts_to_order_items (order_item_id, menu_part_id) VALUES ($1, $2)', [orderItem.getOrderItemID(), menuPart.getMenuPartId()]);
        await this.db.query('UPDATE order_items SET current_price = current_price + $1 WHERE order_item_id = $2', [menuPart.getPrice(), orderItem.getOrderItemID()]);
    }

    /**
     * Removes all menu parts from an order item and resets its price.
     * @param {OrderItem} orderItem - The order item.
     */
    async clearMenuPartsForOrderItem(orderItem) {
        await this.db.runUpdate('DELETE FROM menu_parts_to_order_items WHERE order_item_id = $1', [orderItem.getOrderItemID()]);
        const menuItem = await orderItem.getMenuItem();
        const price = menuItem.getPrice();
        await this.db.query('UPDATE order_items SET current_price = $1 WHERE order_item_id = $2', [price, orderItem.getOrderItemID()]);
    }

    /**
     * Deletes an order item.
     * @param {OrderItem} orderItem - The order item to delete.
     */
    async deleteOrderItem(orderItem) {
        await this.ensureNotFinal(orderItem.getOrderID());
        await this.clearMenuPartsForOrderItem(orderItem);
        await this.db.runUpdate('DELETE FROM order_items WHERE order_item_id = $1', [orderItem.getOrderItemID()]);
    }

    /**
     * Retrieves active (non-finalized) orders.
     * @param {number} limit - The maximum number of orders to return.
     * @param {number} offset - The number of orders to skip.
     * @returns {Promise<Order[]>} A list of active orders.
     */
    async getActiveOrders(limit, offset) {
        const result = await this.db.query('SELECT * FROM orders WHERE is_final = false ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
        return result.rows.map(row => new Order(this.db, row));
    }

    /**
     * Retrieves past (finalized) orders.
     * @param {number} limit - The maximum number of orders to return.
     * @param {number} offset - The number of orders to skip.
     * @returns {Promise<Order[]>} A list of past orders.
     */
    async getPastOrders(limit, offset) {
        const result = await this.db.query('SELECT * FROM orders WHERE is_final = true ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
        return result.rows.map(row => new Order(this.db, row));
    }

    /**
     * Finalizes an order, associating it with a user and updating ingredient stock.
     * @param {Order} order - The order to finalize.
     * @param {number|null} userId - The ID of the user who placed the order.
     */
    async finalizeOrder(order, userId) {
        await this.ensureNotFinal(order.getOrderID());
        if (userId !== null)
            await this.db.query('UPDATE orders SET user_id = $1 WHERE order_id = $2', [userId, order.getOrderID()])
        await this.db.query('UPDATE orders SET is_final = true WHERE order_id = $1', [order.getOrderID()]);
        await this.db.query('UPDATE ingredients SET current_quantity = ingredients.current_quantity - (ingredients_to_menu_parts.quantity_cost * order_items.quantity) FROM menu_parts_to_order_items INNER JOIN order_items ON menu_parts_to_order_items.order_item_id = order_items.order_item_id INNER JOIN ingredients_to_menu_parts ON menu_parts_to_order_items.menu_part_id = ingredients_to_menu_parts.menu_part_id WHERE ingredients.ingredient_id = ingredients_to_menu_parts.ingredient_id AND order_items.order_id = $1', [order.getOrderID()]);
    }

    /**
     * Sets the cooked status of an order.
     * @param {Order} order - The order to update.
     * @param {boolean} is_cooked - The new cooked status.
     */
    async setIsCooked(order, is_cooked) {
        await this.db.query('UPDATE orders SET is_cooked = $1, cooked_at = NOW() WHERE order_id = $2', [is_cooked, order.getOrderID()]);
    }

    /**
     * Retrieves sales data by item within a time range.
     * @param {string} startTime - The start of the time range.
     * @param {string} endTime - The end of the time range.
     * @returns {Promise<ItemSalesReport[]>} A list of sales report data.
     */
    async getSalesByItem(startTime, endTime) {
        const query = `
            SELECT
                menu.item_name AS itemName,
                SUM(order_item.quantity) AS totalQuantity,
                SUM(order_item.quantity * order_item.current_price) AS totalSales,
                ROUND(AVG(order_item.current_price)::numeric, 2) AS averagePrice
            FROM order_items AS order_item
            INNER JOIN menu_items AS menu ON order_item.menu_item_id = menu.menu_item_id
            INNER JOIN orders AS customer_order ON order_item.order_id = customer_order.order_id
            WHERE customer_order.is_final = TRUE
            AND order_item.created_at BETWEEN $1 AND $2
            GROUP BY menu.item_name
            ORDER BY totalSales DESC;
        `;
        const result = await this.db.query(query, [startTime, endTime]);
        return result.rows.map(row => new ItemSalesReport(this.db, row));
    }

    /**
     * Retrieves sales data per hour for a specific day.
     * @param {string} day - The day for the report.
     * @returns {Promise<HourlySales[]>} A list of hourly sales data.
     */
    async getSalesPerHour(day) {
        const query = `
            SELECT
                EXTRACT(HOUR FROM order_items.created_at) AS hour,
                SUM(order_items.quantity * order_items.current_price) AS total_sales
            FROM order_items
            JOIN orders ON order_items.order_id = orders.order_id
            WHERE orders.is_final = TRUE
            AND DATE(order_items.created_at) = $1
            GROUP BY hour
            ORDER BY hour;
        `;
        const result = await this.db.query(query, [day]);
        return result.rows.map(row => new HourlySales(this.db, row));
    }

    /**
     * Ensures an order is not finalized before making changes.
     * @param {number} orderId - The ID of the order to check.
     * @throws {Error} If the order is not found or is already finalized.
     */
    async ensureNotFinal(orderId) {
        const result = await this.db.query('SELECT * FROM orders WHERE order_id = $1', [orderId]);
        if (result.rows.length === 0) {
            throw new Error('Order not found');
        }
        if (result.rows[0].is_final) {
            throw new Error('Order is already finalized');
        }
    }
}

module.exports = OrderManager;
