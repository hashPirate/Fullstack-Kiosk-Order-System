const DatabaseEntry = require('./DatabaseEntry');

class Order extends DatabaseEntry {
    constructor(db, result) {
        super(db, result);
    }

    updateFromResultSet(result) {
        this.order_id = result.order_id;
        this.created_at = result.created_at;
        this.user_id = result.user_id;
        this.is_final = result.is_final;
        this.is_cooked = result.is_cooked;
        this.cooked_at = result.cooked_at;
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

    getUserID() {
        return this.user_id;
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
        return `Order ID: ${this.order_id}, Created At: ${this.created_at}, User ID: ${this.user_id}, Is Final: ${this.is_final}, Is Cooked: ${this.is_cooked}, Cooked At: ${this.cooked_at}`;
    }

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
