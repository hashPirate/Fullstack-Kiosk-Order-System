/**
 * @module model
 */
const DatabaseEntry = require('./DatabaseEntry');

/**
 * Represents an item on the menu board.
 * @class MenuBoardItem
 * @extends DatabaseEntry
 * @param {object} db - The database connection object.
 * @param {object} result - The raw data from the database.
 * @property {number} menu_board_item_id The ID of the menu board item.
 * @property {string} section The section of the menu board this item belongs to.
 * @property {string} item_name The name of the item.
 * @property {number} calories The calorie count of the item.
 * @property {string} calorie_range The calorie range of the item.
 * @property {number} price The price of the item.
 * @property {string} description A description of the item.
 */
class MenuBoardItem extends DatabaseEntry {
    constructor(db, result) {
        super(db, result);
    }

    /**
     * Updates the model's properties from a raw database result set.
     * @param {object} result - The raw database result.
     */
    updateFromResultSet(result) {
        this.menu_board_item_id = result.menu_board_item_id;
        this.section = result.section;
        this.item_name = result.item_name;
        this.calories = result.calories;
        this.calorie_range = result.calorie_range;
        this.price = result.price;
        this.description = result.description;
    }

    /**
     * Gets the primary key value for this entry.
     * @returns {number} The menu board item ID.
     */
    getPrimaryKeyValue() {
        return this.menu_board_item_id;
    }

    /**
     * Gets the menu board item's ID.
     * @returns {number}
     */
    getId() {
        return this.menu_board_item_id;
    }

    /**
     * Gets the section of the menu board this item belongs to.
     * @returns {string}
     */
    getSection() {
        return this.section;
    }

    /**
     * Gets the item's name.
     * @returns {string}
     */
    getItemName() {
        return this.item_name;
    }
    /**
     * Returns a JSON-serializable representation of the menu board item.
     * @returns {object}
     */
    toJSON() {
        return {
            menu_board_item_id: this.menu_board_item_id,
            section: this.section,
            item_name: this.item_name,
            calories: this.calories,
            calorie_range: this.calorie_range,
            price: this.price,
            description: this.description,
        };
    }
}

module.exports = MenuBoardItem;
