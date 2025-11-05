const DbModelManager = require('./DbModelManager');
const MenuItem = require('../model/MenuItem');
const MenuPart = require('../model/MenuPart');
const MenuPartIngredient = require('../model/MenuPartIngredient');

class MenuManager extends DbModelManager {
    constructor(db) {
        super(db);
    }

    async getAllMenuItems() {
        const result = await this.db.query('SELECT * FROM menu_items ORDER BY menu_item_id');
        return result.rows.map(row => new MenuItem(this.db, row));
    }

    async getAllMenuParts() {
        const result = await this.db.query('SELECT * FROM menu_parts ORDER BY menu_part_id');
        return result.rows.map(row => new MenuPart(this.db, row));
    }

    async createMenuItem(item_name, price, for_sale) {
        const result = await this.db.query('INSERT INTO menu_items (item_name, price, for_sale) VALUES ($1, $2, $3) RETURNING *', [item_name, price, for_sale]);
        if (result.rows.length === 0) {
            return null;
        }
        return new MenuItem(this.db, result.rows[0]);
    }

    async createMenuPart(part_name, price, for_sale) {
        const result = await this.db.query('INSERT INTO menu_parts (part_name, price, for_sale) VALUES ($1, $2, $3) RETURNING *', [part_name, price, for_sale]);
        if (result.rows.length === 0) {
            return null;
        }
        return new MenuPart(this.db, result.rows[0]);
    }

    async updateMenuItem(menuItem, itemName, price, for_sale) {
        await this.db.query('UPDATE menu_items SET item_name = $1, price = $2, for_sale = $3 WHERE menu_item_id = $4', [itemName, price, for_sale, menuItem.getMenuItemId()]);
    }

    async updateMenuPart(menuPart, partName, price, for_sale) {
        await this.db.query('UPDATE menu_parts SET part_name = $1, price = $2, for_sale = $3 WHERE menu_part_id = $4', [partName, price, for_sale, menuPart.getMenuPartId()]);
    }

    async getMenuItemById(menu_item_id) {
        const result = await this.db.query('SELECT * FROM menu_items WHERE menu_item_id = $1', [menu_item_id]);
        if (result.rows.length === 0) {
            return null;
        }
        return new MenuItem(this.db, result.rows[0]);
    }

    async getMenuPartsForOrderEntry(orderItem) {
        const result = await this.db.query('SELECT * FROM menu_parts INNER JOIN menu_parts_to_order_items ON menu_parts.menu_part_id = menu_parts_to_order_items.menu_part_id WHERE menu_parts_to_order_items.order_item_id = $1', [orderItem.getOrderItemID()]);
        return result.rows.map(row => new MenuPart(this.db, row));
    }

    async getIngredientsFromMenuPart(menuPart) {
        const result = await this.db.query('SELECT *, itmp.quantity_cost FROM ingredients AS i JOIN ingredients_to_menu_parts AS itmp ON i.ingredient_id = itmp.ingredient_id WHERE itmp.menu_part_id = $1', [menuPart.getMenuPartId()]);
        return result.rows.map(row => new MenuPartIngredient(this.db, row));
    }

    async updateIngredientToMenuPartList(menuPart, ingredientQuantityMap) {
        await this.db.runUpdate('DELETE FROM ingredients_to_menu_parts WHERE menu_part_id = $1', [menuPart.getMenuPartId()]);

        for (const [ingredient, quantity] of ingredientQuantityMap.entries()) {
            await this.db.runUpdate('INSERT INTO ingredients_to_menu_parts (ingredient_id, menu_part_id, quantity_cost) SELECT $1, $2, $3 WHERE NOT EXISTS (SELECT 1 FROM ingredients_to_menu_parts WHERE ingredient_id = $4 AND menu_part_id = $5)', [ingredient.getIngredientId(), menuPart.getMenuPartId(), quantity, ingredient.getIngredientId(), menuPart.getMenuPartId()]);
        }
    }
}

module.exports = MenuManager;
