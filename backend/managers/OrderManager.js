const DbModelManager = require('./DbModelManager');
const Order = require('../model/Order');
const OrderItem = require('../model/OrderItem');
const MenuPart = require('../model/MenuPart');
const ItemSalesReport = require('../model/ItemSalesReport');
const HourlySales = require('../model/HourlySales');

class OrderManager extends DbModelManager {
    constructor(db) {
        super(db);
    }

    async getOrderItemById(orderItemId) {
        const result = await this.db.query('SELECT * FROM order_items WHERE order_item_id = $1', [orderItemId]);
        if (result.rows.length === 0) {
            return null;
        }
        return new OrderItem(this.db, result.rows[0]);
    }

    async getOrderById(orderId) {
        const result = await this.db.query('SELECT * FROM orders WHERE order_id = $1', [orderId]);
        if (result.rows.length === 0) {
            return null;
        }
        return new Order(this.db, result.rows[0]);
    }

    async getLatestOrders(limit, offset) {
        const result = await this.db.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
        return result.rows.map(row => new Order(this.db, row));
    }

    // [Donnell]: for Kitchen View
    async getLatestCookedOrders(limit, offset) {
        const result = await this.db.query('SELECT * FROM orders WHERE is_cooked = TRUE ORDER BY cooked_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
        return result.rows.map(row => new Order(this.db, row));
    }

    // [Donnell]: get all the orders that haven't been cooked yet.
    async getUncookedOrders() {
        const result = await this.db.query('SELECT * FROM orders WHERE is_cooked = FALSE ORDER BY created_at');
        return result.rows.map(row => new Order(this.db, row));
    }

    async getLatestOrdersAfterDateAndFinal(limit, date) {
        const result = await this.db.query('SELECT * FROM orders WHERE created_at::date >= $1 AND is_final = true ORDER BY created_at DESC LIMIT $2', [date, limit]);
        return result.rows.map(row => new Order(this.db, row));
    }

    async getOrdersForUserId(userId, limit, offset) {
        const result = await this.db.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3', [userId, limit, offset]);
        return result.rows.map(row => new Order(this.db, row));
    }

    async getOrderItems(order) {
        const result = await this.db.query('SELECT * FROM order_items WHERE order_id = $1 ORDER BY created_at', [order.getOrderID()]);
        return result.rows.map(row => new OrderItem(this.db, row));
    }

    // [Donnell]: made this to get menu parts for an order item.
    async getMenuPartsFromOrderItem(orderItemId) {
        const query = `
        SELECT menu_parts.menu_part_id, part_name, image_name, price, for_sale FROM menu_parts_to_order_items
        INNER JOIN menu_parts ON menu_parts.menu_part_id = menu_parts_to_order_items.menu_part_id
        WHERE order_item_id = $1;`;
        const result = await this.db.query(query, [orderItemId]);
        return result.rows.map(row => new MenuPart(this.db, row));
    }

    async createOrder() {
        const result = await this.db.query('INSERT INTO orders (created_at, is_final) VALUES (NOW(), false) RETURNING *');
        return new Order(this.db, result.rows[0]);
    }

    async createOrderItem(order, menuItem, quantity) {
        await this.ensureNotFinal(order.getOrderID());
        const result = await this.db.query('INSERT INTO order_items (order_id, menu_item_id, created_at, quantity, current_price) VALUES ($1, $2, NOW(), $3, $4) RETURNING *', [order.getOrderID(), menuItem.getMenuItemId(), quantity, menuItem.getPrice()]);
        return new OrderItem(this.db, result.rows[0]);
    }

    async updateOrderItemMenuItem(orderItem, menuItem, quantity) {
        await this.ensureNotFinal(orderItem.getOrderID());
        await this.clearMenuPartsForOrderItem(orderItem);
        await this.db.query('UPDATE order_items SET menu_item_id = $1, quantity = $2, current_price = $3 WHERE order_item_id = $4', [menuItem.getMenuItemId(), quantity, menuItem.getPrice(), orderItem.getOrderItemID()]);
    }

    async updateOrderItemQuantity(orderItem, quantity) {
        await this.ensureNotFinal(orderItem.getOrderID());
        await this.db.query('UPDATE order_items SET quantity = $1 WHERE order_item_id = $2', [quantity, orderItem.getOrderItemID()]);
    }

    async addMenuPartToOrderItem(orderItem, menuPart) {
        await this.ensureNotFinal(orderItem.getOrderID());
        await this.db.runUpdate('INSERT INTO menu_parts_to_order_items (order_item_id, menu_part_id) VALUES ($1, $2)', [orderItem.getOrderItemID(), menuPart.getMenuPartId()]);
        await this.db.query('UPDATE order_items SET current_price = current_price + $1 WHERE order_item_id = $2', [menuPart.getPrice(), orderItem.getOrderItemID()]);
    }

    async clearMenuPartsForOrderItem(orderItem) {
        await this.db.runUpdate('DELETE FROM menu_parts_to_order_items WHERE order_item_id = $1', [orderItem.getOrderItemID()]);
        const menuItem = await orderItem.getMenuItem();
        const price = menuItem.getPrice();
        await this.db.query('UPDATE order_items SET current_price = $1 WHERE order_item_id = $2', [price, orderItem.getOrderItemID()]);
    }

    async deleteOrderItem(orderItem) {
        await this.ensureNotFinal(orderItem.getOrderID());
        await this.clearMenuPartsForOrderItem(orderItem);
        await this.db.runUpdate('DELETE FROM order_items WHERE order_item_id = $1', [orderItem.getOrderItemID()]);
    }

    async getActiveOrders(limit, offset) {
        const result = await this.db.query('SELECT * FROM orders WHERE is_final = false ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
        return result.rows.map(row => new Order(this.db, row));
    }

    async getPastOrders(limit, offset) {
        const result = await this.db.query('SELECT * FROM orders WHERE is_final = true ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
        return result.rows.map(row => new Order(this.db, row));
    }

    async finalizeOrder(order, userId) {
        await this.ensureNotFinal(order.getOrderID());
        if (userId !== null)
            await this.db.query('UPDATE orders SET user_id = $1 WHERE order_id = $2', [userId, order.getOrderID()])
        await this.db.query('UPDATE orders SET is_final = true WHERE order_id = $1', [order.getOrderID()]);
        await this.db.query('UPDATE ingredients SET current_quantity = ingredients.current_quantity - (ingredients_to_menu_parts.quantity_cost * order_items.quantity) FROM menu_parts_to_order_items INNER JOIN order_items ON menu_parts_to_order_items.order_item_id = order_items.order_item_id INNER JOIN ingredients_to_menu_parts ON menu_parts_to_order_items.menu_part_id = ingredients_to_menu_parts.menu_part_id WHERE ingredients.ingredient_id = ingredients_to_menu_parts.ingredient_id AND order_items.order_id = $1', [order.getOrderID()]);
    }

    async setIsCooked(order, is_cooked) {
        await this.db.query('UPDATE orders SET is_cooked = $1, cooked_at = NOW() WHERE order_id = $2', [is_cooked, order.getOrderID()]);
    }

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
