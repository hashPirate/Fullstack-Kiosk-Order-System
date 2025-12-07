const DbModelManager = require('./DbModelManager');
const MenuBoardItem = require('../model/MenuBoardItem');

class MenuBoardManager extends DbModelManager {
    constructor(db) {
        super(db);
    }
    async getAllMenuBoardItems() {
        const query = `
            SELECT menu_board_item_id, section, item_name, calories, calorie_range, price, description
            FROM "menu_board_items"
            ORDER BY section, item_name`;
        const result = await this.db.query(query);
        return result.rows.map(row => new MenuBoardItem(this.db, row));
    }
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
