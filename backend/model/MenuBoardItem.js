const DatabaseEntry = require('./DatabaseEntry');

class MenuBoardItem extends DatabaseEntry {
    constructor(db, result) {
        super(db, result);
    }

    updateFromResultSet(result) {
        this.menu_board_item_id = result.menu_board_item_id;
        this.section = result.section;
        this.item_name = result.item_name;
        this.calories = result.calories;
        this.calorie_range = result.calorie_range;
        this.price = result.price;
        this.description = result.description;
    }

    getPrimaryKeyValue() {
        return this.menu_board_item_id;
    }

    getId() {
        return this.menu_board_item_id;
    }

    getSection() {
        return this.section;
    }

    getItemName() {
        return this.item_name;
    }
    toJSON() {
        return {
            menu_board_item_id: this.menu_board_item_id,
            section: this.section,
            item_name: this.item_name,
            calories: this.calories,
            calorie_range: this.calorie_range,
            price: this.price,
            description: this.description,
        };
    }
}

module.exports = MenuBoardItem;
