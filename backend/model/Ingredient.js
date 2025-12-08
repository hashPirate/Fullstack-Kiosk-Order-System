/**
 * @module model
 */
const DatabaseEntry = require('./DatabaseEntry');

/**
 * Represents an ingredient in the inventory.
 * @class Ingredient
 * @extends DatabaseEntry
 * @param {object} db - The database connection object.
 * @param {object} result - The raw data from the database.
 * @property {number} ingredient_id The ID of the ingredient.
 * @property {string} name The name of the ingredient.
 * @property {number} current_quantity The current stock quantity.
 * @property {string} quantity_unit The unit of measurement for the quantity.
 * @property {number} alert_threshold The low-stock alert threshold.
 */
class Ingredient extends DatabaseEntry {
    constructor(db, result) {
        super(db, result);
    }

    /**
     * Updates the model's properties from a raw database result set.
     * @param {object} result - The raw database result.
     */
    updateFromResultSet(result) {
        this.ingredient_id = result.ingredient_id;
        this.name = result.name;
        this.current_quantity = result.current_quantity;
        this.quantity_unit = result.quantity_unit;
        this.alert_threshold = result.alert_threshold;
    }

    /**
     * Gets the primary key value for this entry.
     * @returns {number} The ingredient ID.
     */
    getPrimaryKeyValue() {
        return this.ingredient_id;
    }

    /**
     * Gets the ingredient's ID.
     * @returns {number}
     */
    getIngredientId() {
        return this.ingredient_id;
    }

    /**
     * Gets the ingredient's name.
     * @returns {string}
     */
    getName() {
        return this.name;
    }

    /**
     * Gets the current quantity of the ingredient.
     * @returns {number}
     */
    getCurrentQuantity() {
        return this.current_quantity;
    }

    /**
     * Gets the unit of measurement for the quantity.
     * @returns {string}
     */
    getQuantityUnit() {
        return this.quantity_unit;
    }

    /**
     * Gets the alert threshold for low stock.
     * @returns {number}
     */
    getAlertThreshold() {
        return this.alert_threshold;
    }

    /**
     * Checks if the ingredient needs to be restocked.
     * @returns {boolean} True if current quantity is at or below the alert threshold.
     */
    needsRestock() {
        return this.current_quantity <= this.alert_threshold;
    }

    /**
     * Retrieves the dietary restrictions associated with this ingredient.
     * @returns {Promise<DietaryRestriction[]>}
     */
    async getDietaryRestrictions() {
        return this.db.ingredientManager.getDietaryRestrictions(this);
    }

    /**
     * Returns a string representation of the ingredient.
     * @returns {string}
     */
    toString() {
        return `Ingredient ID: ${this.ingredient_id}, Name: ${this.name}, Quantity: ${this.current_quantity} ${this.quantity_unit}`;
    }

    /**
     * Returns a JSON-serializable representation of the ingredient.
     * @returns {object}
     */
    toJSON() {
        return {
            ingredient_id: this.ingredient_id,
            name: this.name,
            current_quantity: this.current_quantity,
            quantity_unit: this.quantity_unit,
            alert_threshold: this.alert_threshold,
        };
    }
}

module.exports = Ingredient;
