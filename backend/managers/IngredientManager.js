/**
 * @module manager
 */
const DbModelManager = require('./DbModelManager');
const Ingredient = require('../model/Ingredient');
const DietaryRestriction = require('../model/DietaryRestriction');

const DEFAULT_ALERT_THRESH = 700;

/**
 * Manages ingredients in the database.
 * @class IngredientManager
 * @extends DbModelManager
 * @param {object} db - The database connection object.
 */
class IngredientManager extends DbModelManager {
    constructor(db) {
        super(db);
    }

    /**
     * Retrieves a paginated list of ingredients.
     * @param {number} limit - The maximum number of ingredients to return.
     * @param {number} offset - The number of ingredients to skip.
     * @returns {Promise<Ingredient[]>} A list of ingredients.
     */
    async getIngredients(limit, offset) {
        const result = await this.db.query('SELECT * FROM ingredients ORDER BY name LIMIT $1 OFFSET $2', [limit, offset]);
        return result.rows.map(row => new Ingredient(this.db, row));
    }

    /**
     * Retrieves all ingredients.
     * @returns {Promise<Ingredient[]>} A list of all ingredients.
     */
    async getAllIngredients() {
        const result = await this.db.query('SELECT * FROM ingredients ORDER BY name');
        return result.rows.map(row => new Ingredient(this.db, row));
    }

    /**
     * Retrieves all ingredients that are in stock.
     * @returns {Promise<Ingredient[]>} A list of in-stock ingredients.
     */
    async getInStockIngredients() {
        const result = await this.db.query('SELECT * FROM ingredients WHERE current_quantity > 0');
        return result.rows.map(row => new Ingredient(this.db, row));
    }

    /**
     * Retrieves all ingredients that are low on stock.
     * @returns {Promise<Ingredient[]>} A list of low-stock ingredients.
     */
    async getLowStockIngredients() {
        const result = await this.db.query('SELECT * FROM ingredients WHERE current_quantity < alert_threshold');
        return result.rows.map(row => new Ingredient(this.db, row));
    }

    /**
     * Retrieves all ingredients that are out of stock.
     * @returns {Promise<Ingredient[]>} A list of out-of-stock ingredients.
     */
    async getOutOfStockIngredients() {
        const result = await this.db.query('SELECT * FROM ingredients WHERE current_quantity <= 0');
        return result.rows.map(row => new Ingredient(this.db, row));
    }

    /**
     * Retrieves an ingredient by its ID.
     * @param {number} ingredient_id - The ID of the ingredient.
     * @returns {Promise<Ingredient|null>} The ingredient object, or null if not found.
     */
    async getIngredientById(ingredient_id) {
        const result = await this.db.query('SELECT * FROM ingredients WHERE ingredient_id = $1', [ingredient_id]);
        if (result.rows.length === 0) {
            return null;
        }
        return new Ingredient(this.db, result.rows[0]);
    }

    /**
     * Creates a new ingredient.
     * @param {string} name - The name of the ingredient.
     * @param {number} current_quantity - The current stock quantity.
     * @param {string} quantity_unit - The unit of measurement.
     * @param {number} alert_threshold - The low-stock alert threshold.
     * @returns {Promise<Ingredient|null>} The newly created ingredient, or null on failure.
     */
    async createIngredient(name, current_quantity, quantity_unit, alert_threshold) {
        const result = await this.db.query('INSERT INTO ingredients (name, current_quantity, quantity_unit, alert_threshold) VALUES ($1, $2, $3, $4) RETURNING *', [name, current_quantity, quantity_unit, alert_threshold]);
        if (result.rows.length === 0) {
            return null;
        }
        return new Ingredient(this.db, result.rows[0]);
    }

    /**
     * Retrieves an ingredient by its name.
     * @param {string} ingredient_name - The name of the ingredient.
     * @returns {Promise<Ingredient|null>} The ingredient object, or null if not found.
     */
    async getIngredientByName(ingredient_name) {
        const result = await this.db.query('SELECT * FROM ingredients WHERE LOWER(name) = LOWER($1)', [ingredient_name.trim()]);
        if (result.rows.length === 0) {
            return null;
        }
        return new Ingredient(this.db, result.rows[0]);
    }

    /**
     * Adds a quantity to an ingredient by name, creating it if it doesn't exist.
     * @param {string} ingredient_name - The name of the ingredient.
     * @param {number} delta - The quantity to add.
     * @param {string} unitIfCreate - The quantity unit to use if creating a new ingredient.
     * @returns {Promise<Ingredient>} The updated or newly created ingredient.
     */
    async addQuantityByName(ingredient_name, delta, unitIfCreate) {
        const inDatabase = await this.getIngredientByName(ingredient_name);
        if (inDatabase === null) {
            return this.createIngredient(ingredient_name, delta, unitIfCreate, DEFAULT_ALERT_THRESH);
        }
        await this.changeQuantity(inDatabase, delta);
        return this.getIngredientById(inDatabase.getIngredientId());
    }

    /**
     * Sets the name of an ingredient.
     * @param {Ingredient} ingredient - The ingredient to update.
     * @param {string} newName - The new name.
     */
    async setName(ingredient, newName) {
        await this.db.query('UPDATE ingredients SET name = $1 WHERE ingredient_id = $2', [newName, ingredient.getIngredientId()]);
    }

    /**
     * Sets the quantity unit of an ingredient.
     * @param {Ingredient} ingredient - The ingredient to update.
     * @param {string} newUnit - The new quantity unit.
     */
    async setQuantityUnit(ingredient, newUnit) {
        await this.db.query('UPDATE ingredients SET quantity_unit = $1 WHERE ingredient_id = $2', [newUnit, ingredient.getIngredientId()]);
    }

    /**
     * Sets the quantity of an ingredient.
     * @param {Ingredient} ingredient - The ingredient to update.
     * @param {number} newQuantity - The new quantity.
     */
    async setQuantity(ingredient, newQuantity) {
        await this.db.query('UPDATE ingredients SET current_quantity = $1 WHERE ingredient_id = $2', [newQuantity, ingredient.getIngredientId()]);
    }

    /**
     * Changes the quantity of an ingredient by a delta.
     * @param {Ingredient} ingredient - The ingredient to update.
     * @param {number} delta - The amount to change the quantity by.
     */
    async changeQuantity(ingredient, delta) {
        await this.db.query('UPDATE ingredients SET current_quantity = current_quantity + $1 WHERE ingredient_id = $2', [delta, ingredient.getIngredientId()]);
    }

    /**
     * Updates all properties of an ingredient.
     * @param {Ingredient} ingredient - The ingredient to update.
     * @param {string} name - The new name.
     * @param {number} current_quantity - The new quantity.
     * @param {string} quantity_unit - The new quantity unit.
     * @param {number} alert_threshold - The new alert threshold.
     */
    async updateIngredient(ingredient, name, current_quantity, quantity_unit, alert_threshold) {
        await this.db.query('UPDATE ingredients SET name = $1, current_quantity = $2, quantity_unit = $3, alert_threshold = $4 WHERE ingredient_id = $5', [name, current_quantity, quantity_unit, alert_threshold, ingredient.getIngredientId()]);
    }

    /**
     * Retrieves all ingredients that need restocking.
     * @returns {Promise<Ingredient[]>} A list of ingredients needing restock.
     */
    async getIngredientsNeedingRestock() {
        const result = await this.db.query('SELECT * FROM ingredients WHERE current_quantity <= alert_threshold ORDER BY name');
        return result.rows.map(row => new Ingredient(this.db, row));
    }

    /**
     * Retrieves the dietary restrictions for an ingredient.
     * @param {Ingredient} ingredient - The ingredient.
     * @returns {Promise<DietaryRestriction[]>} A list of dietary restrictions.
     */
    async getDietaryRestrictions(ingredient) {
        const query = `
            SELECT dr.* FROM dietary_restrictions dr
            JOIN ingredient_dietary_restrictions idr ON dr.dietary_restriction_id = idr.dietary_restriction_id
            WHERE idr.ingredient_id = $1
            ORDER BY dr.dietary_restriction_name;
        `;
        const result = await this.db.query(query, [ingredient.getIngredientId()]);
        return result.rows.map(row => new DietaryRestriction(this.db, row));
    }

    /**
     * Adds a dietary restriction to an ingredient.
     * @param {Ingredient} ingredient - The ingredient.
     * @param {DietaryRestriction} restriction - The restriction to add.
     */
    async addDietaryRestriction(ingredient, restriction) {
        const query = 'INSERT INTO ingredient_dietary_restrictions (ingredient_id, dietary_restriction_id) VALUES ($1, $2) ON CONFLICT DO NOTHING';
        await this.db.query(query, [ingredient.getIngredientId(), restriction.getRestrictionId()]);
    }

    /**
     * Removes a dietary restriction from an ingredient.
     * @param {Ingredient} ingredient - The ingredient.
     * @param {DietaryRestriction} restriction - The restriction to remove.
     */
    async removeDietaryRestriction(ingredient, restriction) {
        const query = 'DELETE FROM ingredient_dietary_restrictions WHERE ingredient_id = $1 AND dietary_restriction_id = $2';
        await this.db.query(query, [ingredient.getIngredientId(), restriction.getRestrictionId()]);
    }

    async deleteIngredient(ingredient_id) {
        await this.db.runUpdate('DELETE FROM ingredients WHERE ingredient_id = $1',[ingredient_id]);
    }
}

module.exports = IngredientManager;
