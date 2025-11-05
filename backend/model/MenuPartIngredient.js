const Ingredient = require('./Ingredient');

class MenuPartIngredient extends Ingredient {
    constructor(db, result) {
        super(db, result);
    }

    updateFromResultSet(result) {
        super.updateFromResultSet(result);
        this.quantity_cost = result.quantity_cost;
    }

    getQuantityCost() {
        return this.quantity_cost;
    }

    toJSON() {
        const baseJson = super.toJSON();
        baseJson.quantity_cost = this.quantity_cost;
        return baseJson;
    }
}

module.exports = MenuPartIngredient;
