const DatabaseEntry = require('./DatabaseEntry');

class Order extends DatabaseEntry {
    constructor(db, result) {
        super(db, result);
    }

    updateFromResultSet(result) {
        this.order_id = result.order_id;
        this.created_at = result.created_at;
        this.is_final = result.is_final;
        this.is_cooked = result.is_cooked;
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

    getIsCooked() {
        return this.is_cooked;
    }

    async getOrderItems() {
        return this.db.orderManager.getOrderItems(this);
    }

    toString() {
        return `Order ID: ${this.order_id}, Created At: ${this.created_at}, Is Final: ${this.is_final}, Is Cooked: ${this.is_cooked}`;
    }

    toJSON() {
        return {
            order_id: this.order_id,
            created_at: this.created_at,
            is_final: this.is_final,
            is_cooked: this.is_cooked,
        };
    }
}

module.exports = Order;
