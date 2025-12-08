/**
 * @module model
 */
const DatabaseEntry = require('./DatabaseEntry');

/**
 * Represents a menu item that can be ordered.
 * @class MenuItem
 * @extends DatabaseEntry
 * @param {object} db - The database connection object.
 * @param {object} result - The raw data from the database.
 * @property {number} menu_item_id The ID of the menu item.
 * @property {string} item_name The name of the item.
 * @property {string} image_name The name of the item's image.
 * @property {number} price The price of the item.
 * @property {boolean} for_sale Whether the item is for sale.
 * @property {number} part_count The number of parts associated with this item.
 */
class MenuItem extends DatabaseEntry {
    constructor(db, result) {
        super(db, result);
    }

    /**
     * Updates the model's properties from a raw database result set.
     * @param {object} result - The raw database result.
     */
    updateFromResultSet(result) {
        this.menu_item_id = result.menu_item_id;
        this.item_name = result.item_name;
        this.image_name = result.image_name;
        this.price = result.price;
        this.for_sale = result.for_sale;
        this.part_count = result.part_count;
        this.is_archived = result.is_archived;
    }

    /**
     * Gets the primary key value for this entry.
     * @returns {number} The menu item ID.
     */
    getPrimaryKeyValue() {
        return this.menu_item_id;
    }

    /**
     * Gets the menu item's ID.
     * @returns {number}
     */
    getMenuItemId() {
        return this.menu_item_id;
    }

    /**
     * Gets the item's name.
     * @returns {string}
     */
    getItemName() {
        return this.item_name;
    }

    /**
     * Gets the item's image name.
     * @returns {string}
     */
    getImageName() {
        return this.image_name;
    }

    /**
     * Gets the item's price.
     * @returns {number}
     */
    getPrice() {
        return this.price;
    }

    /**
     * Gets the for sale status of the item.
     * @returns {boolean}
     */
    getForSale() {
        return this.for_sale;
    }

    /**
     * Gets the number of parts associated with this item.
     * @returns {number}
     */
    getPartCount() {
        return this.part_count;
    }

    /**
     * Returns a string representation of the menu item.
     * @returns {string}
     */
    toString() {
        return `Menu Item ID: ${this.menu_item_id}, Item Name: ${this.item_name}, Image Name: ${this.image_name}, Price: $${this.price.toFixed(2)}, For Sale: ${this.for_sale}, Part Count: ${this.part_count}, Is Archived: ${this.is_archived}`;
    }

    /**
     * Returns a JSON-serializable representation of the menu item.
     * @returns {object}
     */
    toJSON() {
        return {
            menu_item_id: this.menu_item_id,
            item_name: this.item_name,
            image_name: this.image_name,
            price: this.price,
            for_sale: this.for_sale,
            part_count: this.part_count,
            is_archived: this.is_archived
        };
    }
}

module.exports = MenuItem;
