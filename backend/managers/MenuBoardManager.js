/**
 * @module manager
 */
const DbModelManager = require('./DbModelManager');
const MenuBoardItem = require('../model/MenuBoardItem');

/**
 * Manages menu board items in the database.
 * @class MenuBoardManager
 * @extends DbModelManager
 * @param {object} db - The database connection object.
 */
class MenuBoardManager extends DbModelManager {
    constructor(db) {
        super(db);
    }
    /**
     * Retrieves all menu board items.
     * @returns {Promise<MenuBoardItem[]>} A list of all menu board items.
     */
    async getAllMenuBoardItems() {
        const query = `
            SELECT menu_board_item_id, section, item_name, calories, calorie_range, price, description
            FROM "menu_board_items"
            ORDER BY section, item_name`;
        const result = await this.db.query(query);
        return result.rows.map(row => new MenuBoardItem(this.db, row));
    }
    /**
     * Creates a new menu board item.
     * @param {object} itemData - The data for the new item.
     * @returns {Promise<MenuBoardItem>} The newly created menu board item.
     */
    async createMenuBoardItem({ section, item_name, calories, calorie_range, price, description }) {
        const query = `
            INSERT INTO "menu_board_items" (section, item_name, calories, calorie_range, price, description) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING menu_board_item_id, section, item_name, calories, calorie_range, price, description`;
        const params = [section, item_name,
            calories !== undefined && calories !== "" ? calories : null,calorie_range || null,price !== undefined && price !== ""? price : null,
            description || null,];
        const result = await this.db.query(query, params);
        return new MenuBoardItem(this.db, result.rows[0]);
    }

    /**
     * Updates a menu board item.
     * @param {number} id - The ID of the item to update.
     * @param {object} itemData - The new data for the item.
     * @returns {Promise<MenuBoardItem|null>} The updated menu board item, or null if not found.
     */
    async updateMenuBoardItem(id, { item_name, calories, calorie_range, price, description}) {
        const query = `
            UPDATE "menu_board_items"
            SET item_name = $1, calories = $2, calorie_range = $3, price = $4, description = $5 WHERE menu_board_item_id = $6
            RETURNING menu_board_item_id, section, item_name, calories, calorie_range, price, description
        `;
        const params = [item_name, calories !== undefined && calories !== "" ? calories : null, calorie_range || null,price !== undefined && price !== "" ? price : null,
            description || null,id,];
        const result = await this.db.query(query,params);
        if(result.rows.length ===0){
            return null;
        }
        return new MenuBoardItem(this.db, result.rows[0]);
    }
    /**
     * Deletes a menu board item.
     * @param {number} id - The ID of the item to delete.
     * @returns {Promise<boolean>} True if the item was deleted, false otherwise.
     */
    async deleteMenuBoardItem(id) {
        const query = `
            DELETE FROM "menu_board_items"
            WHERE menu_board_item_id = $1
            RETURNING menu_board_item_id`;
        const result = await this.db.query(query, [id]);
        if (result.rows.length === 0){
            return false;
        }
        return true;
    }
}
module.exports = MenuBoardManager;
