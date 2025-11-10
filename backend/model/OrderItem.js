const DatabaseEntry = require('./DatabaseEntry');

class OrderItem extends DatabaseEntry {
    constructor(db, result) {
        super(db, result);
    }

    updateFromResultSet(result) {
        this.order_item_id = result.order_item_id;
        this.order_id = result.order_id;
        this.menu_item_id = result.menu_item_id;
        this.created_at = result.created_at;
        this.quantity = result.quantity;
        this.current_price = result.current_price;
    }

    getPrimaryKeyValue() {
        return this.order_item_id;
    }

    getOrderItemID() {
        return this.order_item_id;
    }

    getOrderID() {
        return this.order_id;
    }

    async getMenuItem() {
        return this.db.menuManager.getMenuItemById(this.menu_item_id);
    }

    async getMenuParts() {
        return this.db.menuManager.getMenuPartsForOrderEntry(this);
    }

    getQuantity() {
        return this.quantity;
    }

    getPrice() {
        return this.current_price;
    }

    toString() {
        return `OrderItem ID: ${this.order_item_id}, Order ID: ${this.order_id}, Menu Item ID: ${this.menu_item_id}, Created At: ${this.created_at}, Quantity: ${this.quantity}, Current Price: ${this.current_price.toFixed(2)}`;
    }

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
