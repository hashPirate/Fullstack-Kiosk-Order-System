/**
 * @module model
 */
const DatabaseEntry = require('./DatabaseEntry');

/**
 * Represents a customizable part of a menu item.
 * @class MenuPart
 * @extends DatabaseEntry
 * @param {object} db - The database connection object.
 * @param {object} result - The raw data from the database.
 * @property {number} menu_part_id The ID of the menu part.
 * @property {string} part_name The name of the part.
 * @property {string} image_name The name of the part's image.
 * @property {number} price The price of the part.
 * @property {boolean} for_sale Whether the part is for sale.
 */
class MenuPart extends DatabaseEntry {
    constructor(db, result) {
        super(db, result);
    }

    /**
     * Updates the model's properties from a raw database result set.
     * @param {object} result - The raw database result.
     */
    updateFromResultSet(result) {
        this.menu_part_id = result.menu_part_id;
        this.part_name = result.part_name;
        this.image_name = result.image_name;
        this.price = result.price;
        this.for_sale = result.for_sale;
    }

    /**
     * Gets the primary key value for this entry.
     * @returns {number} The menu part ID.
     */
    getPrimaryKeyValue() {
        return this.menu_part_id;
    }

    /**
     * Gets the menu part's ID.
     * @returns {number}
     */
    getMenuPartId() {
        return this.menu_part_id;
    }

    /**
     * Gets the menu part's image name.
     * @returns {string}
     */
    getImageName() {
        return this.image_name;
    }

    /**
     * Gets the menu part's name.
     * @returns {string}
     */
    getPartName() {
        return this.part_name;
    }

    /**
     * Gets the menu part's price.
     * @returns {number}
     */
    getPrice() {
        return this.price;
    }

    /**
     * Gets the for sale status of the menu part.
     * @returns {boolean}
     */
    getForSale() {
        return this.for_sale;
    }

    /**
     * Retrieves the dietary restrictions associated with this menu part.
     * @returns {Promise<DietaryRestriction[]>}
     */
    async getDietaryRestrictions() {
        return this.db.menuManager.getDietaryRestrictionsForMenuPart(this);
    }

    /**
     * Returns a string representation of the menu part.
     * @returns {string}
     */
    toString() {
        return `Menu Part ID: ${this.menu_part_id}, Part Name: ${this.part_name}, Image Name: ${this.image_name}, Price: $${this.price.toFixed(2)}, For Sale: ${this.for_sale}`;
    }

    /**
     * Returns a JSON-serializable representation of the menu part.
     * @returns {object}
     */
    toJSON() {
        return {
            menu_part_id: this.menu_part_id,
            part_name: this.part_name,
            image_name: this.image_name,
            price: this.price,
            for_sale: this.for_sale,
        };
    }
}

module.exports = MenuPart;
