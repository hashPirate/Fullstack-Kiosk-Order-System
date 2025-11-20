const DatabaseEntry = require('./DatabaseEntry');

class MenuItem extends DatabaseEntry {
    constructor(db, result) {
        super(db, result);
    }

    updateFromResultSet(result) {
        this.menu_item_id = result.menu_item_id;
        this.item_name = result.item_name;
        this.image_name = result.image_name;
        this.price = result.price;
        this.for_sale = result.for_sale;
        this.part_count = result.part_count;
    }

    getPrimaryKeyValue() {
        return this.menu_item_id;
    }

    getMenuItemId() {
        return this.menu_item_id;
    }

    getItemName() {
        return this.item_name;
    }

    getImageName() {
        return this.image_name;
    }

    getPrice() {
        return this.price;
    }

    getForSale() {
        return this.for_sale;
    }

    getPartCount() {
        return this.part_count;
    }

    toString() {
        return `Menu Item ID: ${this.menu_item_id}, Item Name: ${this.item_name}, Image Name: ${this.image_name}, Price: $${this.price.toFixed(2)}, For Sale: ${this.for_sale}, Part Count: ${this.part_count}`;
    }

    toJSON() {
        return {
            menu_item_id: this.menu_item_id,
            item_name: this.item_name,
            image_name: this.image_name,
            price: this.price,
            for_sale: this.for_sale,
            part_count: this.part_count,
        };
    }
}

module.exports = MenuItem;
