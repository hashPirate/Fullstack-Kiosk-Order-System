const DatabaseEntry = require('./DatabaseEntry');

class Ingredient extends DatabaseEntry {
    constructor(db, result) {
        super(db, result);
    }

    updateFromResultSet(result) {
        this.ingredient_id = result.ingredient_id;
        this.name = result.name;
        this.current_quantity = result.current_quantity;
        this.quantity_unit = result.quantity_unit;
        this.alert_threshold = result.alert_threshold;
    }

    getPrimaryKeyValue() {
        return this.ingredient_id;
    }

    getIngredientId() {
        return this.ingredient_id;
    }

    getName() {
        return this.name;
    }

    getCurrentQuantity() {
        return this.current_quantity;
    }

    getQuantityUnit() {
        return this.quantity_unit;
    }

    getAlertThreshold() {
        return this.alert_threshold;
    }

    needsRestock() {
        return this.current_quantity <= this.alert_threshold;
    }

    async getDietaryRestrictions() {
        return this.db.ingredientManager.getDietaryRestrictions(this);
    }

    toString() {
        return `Ingredient ID: ${this.ingredient_id}, Name: ${this.name}, Quantity: ${this.current_quantity} ${this.quantity_unit}`;
    }

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
