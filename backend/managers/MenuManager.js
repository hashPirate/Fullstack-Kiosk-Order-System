/**
 * @module manager
 */
const DbModelManager = require('./DbModelManager');
const MenuItem = require('../model/MenuItem');
const MenuPart = require('../model/MenuPart');
const MenuPartIngredient = require('../model/MenuPartIngredient');
const DietaryRestriction = require('../model/DietaryRestriction');

/**
 * Manages menu items and parts in the database.
 * @class MenuManager
 * @extends DbModelManager
 * @param {object} db - The database connection object.
 */
class MenuManager extends DbModelManager {
    constructor(db) {
        super(db);
    }

    /**
     * Retrieves all menu items.
     * @returns {Promise<MenuItem[]>} A list of all menu items.
     */
    async getAllMenuItems() {
        const result = await this.db.query('SELECT * FROM menu_items WHERE is_archived = FALSE ORDER BY menu_item_id');
        return result.rows.map(row => new MenuItem(this.db, row));
    }

    /**
     * Retrieves all menu parts.
     * @returns {Promise<MenuPart[]>} A list of all menu parts.
     */
    async getAllMenuParts() {
        const result = await this.db.query('SELECT * FROM menu_parts WHERE is_archived = FALSE ORDER BY menu_part_id');
        return result.rows.map(row => new MenuPart(this.db, row));
    }

    /**
     * Creates a new menu item.
     * @param {string} item_name - The name of the menu item.
     * @param {number} price - The price of the menu item.
     * @param {boolean} for_sale - Whether the item is for sale.
     * @param {string} image_name - The image name for the menu item.
     * @returns {Promise<MenuItem|null>} The newly created menu item, or null on failure.
     */
    async createMenuItem(item_name, price, for_sale, image_name) {
        const result = await this.db.query('INSERT INTO menu_items (item_name, price, for_sale, image_name) VALUES ($1, $2, $3, $4) RETURNING *', [item_name, price, for_sale, image_name]);
        if (result.rows.length === 0) {
            return null;
        }
        return new MenuItem(this.db, result.rows[0]);
    }

    /**
     * Creates a new menu part.
     * @param {string} part_name - The name of the menu part.
     * @param {number} price - The price of the menu part.
     * @param {boolean} for_sale - Whether the part is for sale.
     * @param {string} image_name - The image name for the menu part.
     * @returns {Promise<MenuPart|null>} The newly created menu part, or null on failure.
     */
    async createMenuPart(part_name, price, for_sale, image_name) {
        const result = await this.db.query('INSERT INTO menu_parts (part_name, price, for_sale, image_name) VALUES ($1, $2, $3, $4) RETURNING *', [part_name, price, for_sale, image_name]);
        if (result.rows.length === 0) {
            return null;
        }
        return new MenuPart(this.db, result.rows[0]);
    }

    /**
     * Updates a menu item.
     * @param {MenuItem} menuItem - The menu item to update.
     * @param {string} itemName - The new name.
     * @param {number} price - The new price.
     * @param {boolean} for_sale - The new for_sale status.
     * @param {string} image_name - The new image name for the menu item.
     */
    async updateMenuItem(menuItem, itemName, price, for_sale, image_name) {
        await this.db.query('UPDATE menu_items SET item_name = $1, price = $2, for_sale = $3, image_name = $4 WHERE menu_item_id = $5', [itemName, price, for_sale, image_name, menuItem.getMenuItemId()]);
    }

    /**
     * Updates a menu part.
     * @param {MenuPart} menuPart - The menu part to update.
     * @param {string} partName - The new name.
     * @param {number} price - The new price.
     * @param {boolean} for_sale - The new for_sale status.
     * @param {string} image_name - The new image name for the menu part.
     */
    async updateMenuPart(menuPart, partName, price, for_sale, image_name) {
        await this.db.query('UPDATE menu_parts SET part_name = $1, price = $2, for_sale = $3, image_name = $4 WHERE menu_part_id = $5', [partName, price, for_sale, image_name, menuPart.getMenuPartId()]);
    }

    /**
     * Retrieves a menu item by its ID.
     * @param {number} menu_item_id - The ID of the menu item.
     * @returns {Promise<MenuItem|null>} The menu item object, or null if not found.
     */
    async getMenuItemById(menu_item_id) {
        const result = await this.db.query('SELECT * FROM menu_items WHERE menu_item_id = $1', [menu_item_id]);
        if (result.rows.length === 0) {
            return null;
        }
        return new MenuItem(this.db, result.rows[0]);
    }

    /**
     * Retrieves a menu part by its ID.
     * @param {number} menu_part_id - The ID of the menu part.
     * @returns {Promise<MenuPart|null>} The menu part object, or null if not found.
     */
    async getMenuPartById(menu_part_id) {
        const result = await this.db.query('SELECT * FROM menu_parts WHERE menu_part_id = $1', [menu_part_id]);
        if (result.rows.length === 0) {
            return null;
        }
        return new MenuPart(this.db, result.rows[0]);
    }

    // [Donnell]
    async archiveMenuPartById(menu_part_id) {
        await this.db.runUpdate('UPDATE menu_parts SET is_archived = TRUE, for_sale = FALSE WHERE menu_part_id = $1', [menu_part_id]);
    }

    async archiveMenuItemById(menu_item_id) {
        await this.db.runUpdate('UPDATE menu_items SET is_archived = TRUE, for_sale = FALSE WHERE menu_item_id = $1', [menu_item_id]);
    }

    /**
     * Retrieves the menu parts for an order item.
     * @param {OrderItem} orderItem - The order item.
     * @returns {Promise<MenuPart[]>} A list of menu parts.
     */
    async getMenuPartsForOrderEntry(orderItem) {
        const result = await this.db.query('SELECT * FROM menu_parts INNER JOIN menu_parts_to_order_items ON menu_parts.menu_part_id = menu_parts_to_order_items.menu_part_id WHERE menu_parts_to_order_items.order_item_id = $1', [orderItem.getOrderItemID()]);
        return result.rows.map(row => new MenuPart(this.db, row));
    }

    /**
     * Retrieves the menu parts for a menu item.
     * @param {MenuItem} menuItem - The menu item.
     * @returns {Promise<MenuPart[]>} A list of menu parts.
     */
    async getMenuPartsForMenuItem(menuItem) {
        const result = await this.db.query(
            `SELECT mp.* FROM menu_parts mp
JOIN menu_parts_to_menu_items mptmi ON mp.menu_part_id = mptmi.menu_part_id 
WHERE mp.is_archived = FALSE 
  AND mptmi.menu_item_id = $1 
ORDER BY mp.menu_part_id;`,
            [menuItem.getMenuItemId()]);
        return result.rows.map(row => new MenuPart(this.db, row));
    }

    /**
     * Adds a menu part to a menu item.
     * @param {MenuItem} menuItem - The menu item.
     * @param {MenuPart} menuPart - The menu part to add.
     */
    async addMenuPartToMenuItem(menuItem, menuPart) {
        await this.db.runUpdate('INSERT INTO menu_parts_to_menu_items (menu_item_id, menu_part_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [menuItem.getMenuItemId(), menuPart.getMenuPartId()]);
    }

    /**
     * Removes a menu part from a menu item.
     * @param {MenuItem} menuItem - The menu item.
     * @param {MenuPart} menuPart - The menu part to remove.
     */
    async removeMenuPartFromMenuItem(menuItem, menuPart) {
        await this.db.runUpdate('DELETE FROM menu_parts_to_menu_items WHERE menu_item_id = $1 AND menu_part_id = $2', [menuItem.getMenuItemId(), menuPart.getMenuPartId()]);
    }

    /**
     * Retrieves the ingredients for a menu part.
     * @param {MenuPart} menuPart - The menu part.
     * @returns {Promise<MenuPartIngredient[]>} A list of ingredients with their quantities.
     */
    async getIngredientsFromMenuPart(menuPart) {
        const result = await this.db.query('SELECT *, itmp.quantity_cost FROM ingredients AS i JOIN ingredients_to_menu_parts AS itmp ON i.ingredient_id = itmp.ingredient_id WHERE itmp.menu_part_id = $1', [menuPart.getMenuPartId()]);
        return result.rows.map(row => new MenuPartIngredient(this.db, row));
    }

    /**
     * Retrieves the dietary restrictions for a menu part.
     * @param {MenuPart} menuPart - The menu part.
     * @returns {Promise<DietaryRestriction[]>} A list of dietary restrictions.
     */
    async getDietaryRestrictionsForMenuPart(menuPart) {
        const query = `
            SELECT DISTINCT dr.*
            FROM dietary_restrictions dr
            JOIN ingredient_dietary_restrictions idr ON dr.dietary_restriction_id = idr.dietary_restriction_id
            JOIN ingredients_to_menu_parts itmp ON idr.ingredient_id = itmp.ingredient_id
            WHERE itmp.menu_part_id = $1
            ORDER BY dr.dietary_restriction_name;
        `;
        const result = await this.db.query(query, [menuPart.getMenuPartId()]);
        return result.rows.map(row => new DietaryRestriction(this.db, row));
    }

    /**
     * Updates the list of ingredients and their quantities for a menu part.
     * @param {MenuPart} menuPart - The menu part to update.
     * @param {Map<Ingredient, number>} ingredientQuantityMap - A map of Ingredient objects to their quantities.
     */
    async updateIngredientToMenuPartList(menuPart, ingredientQuantityMap) {
        await this.db.runUpdate('DELETE FROM ingredients_to_menu_parts WHERE menu_part_id = $1', [menuPart.getMenuPartId()]);

        for (const [ingredient, quantity] of ingredientQuantityMap.entries()) {
            if (quantity > 0) {
                await this.db.runUpdate('INSERT INTO ingredients_to_menu_parts (ingredient_id, menu_part_id, quantity_cost) SELECT $1, $2, $3 WHERE NOT EXISTS (SELECT 1 FROM ingredients_to_menu_parts WHERE ingredient_id = $4 AND menu_part_id = $5)', [ingredient.getIngredientId(), menuPart.getMenuPartId(), quantity, ingredient.getIngredientId(), menuPart.getMenuPartId()]);
            }
        }
    }
}

module.exports = MenuManager;
