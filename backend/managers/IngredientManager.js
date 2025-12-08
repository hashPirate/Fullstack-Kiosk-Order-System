const DbModelManager = require('./DbModelManager');
const Ingredient = require('../model/Ingredient');
const DietaryRestriction = require('../model/DietaryRestriction');

const DEFAULT_ALERT_THRESH = 700;

class IngredientManager extends DbModelManager {
    constructor(db) {
        super(db);
    }

    async getIngredients(limit, offset) {
        const result = await this.db.query('SELECT * FROM ingredients ORDER BY name LIMIT $1 OFFSET $2', [limit, offset]);
        return result.rows.map(row => new Ingredient(this.db, row));
    }

    async getAllIngredients() {
        const result = await this.db.query('SELECT * FROM ingredients ORDER BY name');
        return result.rows.map(row => new Ingredient(this.db, row));
    }

    async getInStockIngredients() {
        const result = await this.db.query('SELECT * FROM ingredients WHERE current_quantity > 0');
        return result.rows.map(row => new Ingredient(this.db, row));
    }

    async getLowStockIngredients() {
        const result = await this.db.query('SELECT * FROM ingredients WHERE current_quantity < alert_threshold');
        return result.rows.map(row => new Ingredient(this.db, row));
    }

    async getOutOfStockIngredients() {
        const result = await this.db.query('SELECT * FROM ingredients WHERE current_quantity <= 0');
        return result.rows.map(row => new Ingredient(this.db, row));
    }

    async getIngredientById(ingredient_id) {
        const result = await this.db.query('SELECT * FROM ingredients WHERE ingredient_id = $1', [ingredient_id]);
        if (result.rows.length === 0) {
            return null;
        }
        return new Ingredient(this.db, result.rows[0]);
    }

    async createIngredient(name, current_quantity, quantity_unit, alert_threshold) {
        const result = await this.db.query('INSERT INTO ingredients (name, current_quantity, quantity_unit, alert_threshold) VALUES ($1, $2, $3, $4) RETURNING *', [name, current_quantity, quantity_unit, alert_threshold]);
        if (result.rows.length === 0) {
            return null;
        }
        return new Ingredient(this.db, result.rows[0]);
    }

    async getIngredientByName(ingredient_name) {
        const result = await this.db.query('SELECT * FROM ingredients WHERE LOWER(name) = LOWER($1)', [ingredient_name.trim()]);
        if (result.rows.length === 0) {
            return null;
        }
        return new Ingredient(this.db, result.rows[0]);
    }

    async addQuantityByName(ingredient_name, delta, unitIfCreate) {
        const inDatabase = await this.getIngredientByName(ingredient_name);
        if (inDatabase === null) {
            return this.createIngredient(ingredient_name, delta, unitIfCreate, DEFAULT_ALERT_THRESH);
        }
        await this.changeQuantity(inDatabase, delta);
        return this.getIngredientById(inDatabase.getIngredientId());
    }

    async setName(ingredient, newName) {
        await this.db.query('UPDATE ingredients SET name = $1 WHERE ingredient_id = $2', [newName, ingredient.getIngredientId()]);
    }

    async setQuantityUnit(ingredient, newUnit) {
        await this.db.query('UPDATE ingredients SET quantity_unit = $1 WHERE ingredient_id = $2', [newUnit, ingredient.getIngredientId()]);
    }

    async setQuantity(ingredient, newQuantity) {
        await this.db.query('UPDATE ingredients SET current_quantity = $1 WHERE ingredient_id = $2', [newQuantity, ingredient.getIngredientId()]);
    }

    async changeQuantity(ingredient, delta) {
        await this.db.query('UPDATE ingredients SET current_quantity = current_quantity + $1 WHERE ingredient_id = $2', [delta, ingredient.getIngredientId()]);
    }

    async updateIngredient(ingredient, name, current_quantity, quantity_unit, alert_threshold) {
        await this.db.query('UPDATE ingredients SET name = $1, current_quantity = $2, quantity_unit = $3, alert_threshold = $4 WHERE ingredient_id = $5', [name, current_quantity, quantity_unit, alert_threshold, ingredient.getIngredientId()]);
    }

    async getIngredientsNeedingRestock() {
        const result = await this.db.query('SELECT * FROM ingredients WHERE current_quantity <= alert_threshold ORDER BY name');
        return result.rows.map(row => new Ingredient(this.db, row));
    }

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

    async addDietaryRestriction(ingredient, restriction) {
        const query = 'INSERT INTO ingredient_dietary_restrictions (ingredient_id, dietary_restriction_id) VALUES ($1, $2) ON CONFLICT DO NOTHING';
        await this.db.query(query, [ingredient.getIngredientId(), restriction.getRestrictionId()]);
    }

    async removeDietaryRestriction(ingredient, restriction) {
        const query = 'DELETE FROM ingredient_dietary_restrictions WHERE ingredient_id = $1 AND dietary_restriction_id = $2';
        await this.db.query(query, [ingredient.getIngredientId(), restriction.getRestrictionId()]);
    }
}

module.exports = IngredientManager;
