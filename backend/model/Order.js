/**
 * @module model
 */
const DatabaseEntry = require('./DatabaseEntry');

/**
 * Represents a customer order.
 * @class Order
 * @extends DatabaseEntry
 * @param {object} db - The database connection object.
 * @param {object} result - The raw data from the database.
 * @property {number} order_id The ID of the order.
 * @property {Date} created_at The timestamp when the order was created.
 * @property {number} user_id The ID of the user who placed the order.
 * @property {boolean} is_final Whether the order has been finalized.
 * @property {boolean} is_cooked Whether the order has been cooked.
 * @property {Date} cooked_at The timestamp when the order was marked as cooked.
 */
class Order extends DatabaseEntry {
    constructor(db, result) {
        super(db, result);
    }

    /**
     * Updates the model's properties from a raw database result set.
     * @param {object} result - The raw database result.
     */
    updateFromResultSet(result) {
        this.order_id = result.order_id;
        this.created_at = result.created_at;
        this.user_id = result.user_id;
        this.is_final = result.is_final;
        this.is_cooked = result.is_cooked;
        this.cooked_at = result.cooked_at;
    }

    /**
     * Gets the primary key value for this entry.
     * @returns {number} The order ID.
     */
    getPrimaryKeyValue() {
        return this.order_id;
    }

    /**
     * Gets the order's ID.
     * @returns {number}
     */
    getOrderID() {
        return this.order_id;
    }

    /**
     * Gets the creation timestamp of the order.
     * @returns {Date}
     */
    getCreatedAt() {
        return this.created_at;
    }

    /**
     * Gets the ID of the user who placed the order.
     * @returns {number|null}
     */
    getUserID() {
        return this.user_id;
    }

    /**
     * Gets the finalization status of the order.
     * @returns {boolean}
     */
    getIsFinal() {
        return this.is_final;
    }

    /**
     * Gets the cooked status of the order.
     * @returns {boolean}
     */
    getIsCooked() {
        return this.is_cooked;
    }

    /**
     * Retrieves all items associated with this order.
     * @returns {Promise<OrderItem[]>}
     */
    async getOrderItems() {
        return this.db.orderManager.getOrderItems(this);
    }

    /**
     * Returns a string representation of the order.
     * @returns {string}
     */
    toString() {
        return `Order ID: ${this.order_id}, Created At: ${this.created_at}, User ID: ${this.user_id}, Is Final: ${this.is_final}, Is Cooked: ${this.is_cooked}, Cooked At: ${this.cooked_at}`;
    }

    /**
     * Returns a JSON-serializable representation of the order.
     * @returns {object}
     */
    toJSON() {
        return {
            order_id: this.order_id,
            created_at: this.created_at,
            is_final: this.is_final,
            is_cooked: this.is_cooked,
            cooked_at: this.cooked_at
        };
    }
}

module.exports = Order;
