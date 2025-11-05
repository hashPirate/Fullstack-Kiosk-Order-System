const DatabaseEntry = require('./DatabaseEntry');

class Order extends DatabaseEntry {
    constructor(db, result) {
        super(db, result);
    }

    updateFromResultSet(result) {
        this.order_id = result.order_id;
        this.created_at = result.created_at;
        this.is_final = result.is_final;
    }

    getPrimaryKeyValue() {
        return this.order_id;
    }

    getOrderID() {
        return this.order_id;
    }

    getCreatedAt() {
        return this.created_at;
    }

    getIsFinal() {
        return this.is_final;
    }

    async getOrderItems() {
        return this.db.orderManager.getOrderItems(this);
    }

    toString() {
        return `Order ID: ${this.order_id}, Created At: ${this.created_at}, Is Final: ${this.is_final}`;
    }

    toJSON() {
        return {
            order_id: this.order_id,
            created_at: this.created_at,
            is_final: this.is_final,
        };
    }
}

module.exports = Order;
