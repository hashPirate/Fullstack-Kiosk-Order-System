/**
 * @module model
 */
const DatabaseEntry = require('./DatabaseEntry');

/**
 * Represents an item within an order.
 * @class OrderItem
 * @extends DatabaseEntry
 * @param {object} db - The database connection object.
 * @param {object} result - The raw data from the database.
 * @property {number} order_item_id The ID of the order item.
 * @property {number} order_id The ID of the order this item belongs to.
 * @property {number} menu_item_id The ID of the menu item.
 * @property {Date} created_at The timestamp when the item was added to the order.
 * @property {number} quantity The quantity of this item.
 * @property {number} current_price The price of the item at the time of order.
 */
class OrderItem extends DatabaseEntry {
    constructor(db, result) {
        super(db, result);
    }

    /**
     * Updates the model's properties from a raw database result set.
     * @param {object} result - The raw database result.
     */
    updateFromResultSet(result) {
        this.order_item_id = result.order_item_id;
        this.order_id = result.order_id;
        this.menu_item_id = result.menu_item_id;
        this.created_at = result.created_at;
        this.quantity = result.quantity;
        this.current_price = result.current_price;
    }

    /**
     * Gets the primary key value for this entry.
     * @returns {number} The order item ID.
     */
    getPrimaryKeyValue() {
        return this.order_item_id;
    }

    /**
     * Gets the order item's ID.
     * @returns {number}
     */
    getOrderItemID() {
        return this.order_item_id;
    }

    /**
     * Gets the ID of the order this item belongs to.
     * @returns {number}
     */
    getOrderID() {
        return this.order_id;
    }

    /**
     * Retrieves the menu item associated with this order item.
     * @returns {Promise<MenuItem>}
     */
    async getMenuItem() {
        return this.db.menuManager.getMenuItemById(this.menu_item_id);
    }

    /**
     * Retrieves the menu parts associated with this order item.
     * @returns {Promise<MenuPart[]>}
     */
    async getMenuParts() {
        return this.db.menuManager.getMenuPartsForOrderEntry(this);
    }

    /**
     * Gets the quantity of this item in the order.
     * @returns {number}
     */
    getQuantity() {
        return this.quantity;
    }

    /**
     * Gets the price of this item at the time of order.
     * @returns {number}
     */
    getPrice() {
        return this.current_price;
    }

    /**
     * Returns a string representation of the order item.
     * @returns {string}
     */
    toString() {
        return `OrderItem ID: ${this.order_item_id}, Order ID: ${this.order_id}, Menu Item ID: ${this.menu_item_id}, Created At: ${this.created_at}, Quantity: ${this.quantity}, Current Price: ${this.current_price.toFixed(2)}`;
    }

    /**
     * Returns a JSON-serializable representation of the order item.
     * @returns {object}
     */
    toJSON() {
        return {
            order_item_id: this.order_item_id,
            order_id: this.order_id,
            menu_item_id: this.menu_item_id,
            created_at: this.created_at,
            quantity: this.quantity,
            current_price: this.current_price,
        };
    }
}

module.exports = OrderItem;
