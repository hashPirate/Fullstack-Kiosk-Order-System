/**
 * @module model
 */
const Ingredient = require('./Ingredient');

/**
 * Represents an ingredient as part of a menu part, including the quantity used.
 * @class MenuPartIngredient
 * @extends Ingredient
 * @param {object} db - The database connection object.
 * @param {object} result - The raw data from the database.
 * @property {number} quantity_cost The quantity of this ingredient used in the menu part.
 */
class MenuPartIngredient extends Ingredient {
    constructor(db, result) {
        super(db, result);
    }

    /**
     * Updates the model's properties from a raw database result set.
     * @param {object} result - The raw database result.
     */
    updateFromResultSet(result) {
        super.updateFromResultSet(result);
        this.quantity_cost = result.quantity_cost;
    }

    /**
     * Gets the quantity of this ingredient used in the menu part.
     * @returns {number}
     */
    getQuantityCost() {
        return this.quantity_cost;
    }

    /**
     * Returns a JSON-serializable representation of the menu part ingredient.
     * @returns {object}
     */
    toJSON() {
        const baseJson = super.toJSON();
        baseJson.quantity_cost = this.quantity_cost;
        return baseJson;
    }
}

module.exports = MenuPartIngredient;
