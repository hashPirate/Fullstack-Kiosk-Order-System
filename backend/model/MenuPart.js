const DatabaseEntry = require('./DatabaseEntry');

class MenuPart extends DatabaseEntry {
    constructor(db, result) {
        super(db, result);
    }

    updateFromResultSet(result) {
        this.menu_part_id = result.menu_part_id;
        this.part_name = result.part_name;
        this.image_name = result.image_name;
        this.price = result.price;
        this.for_sale = result.for_sale;
    }

    getPrimaryKeyValue() {
        return this.menu_part_id;
    }

    getMenuPartId() {
        return this.menu_part_id;
    }

    getImageName() {
        return this.image_name;
    }

    getPartName() {
        return this.part_name;
    }

    getPrice() {
        return this.price;
    }

    getForSale() {
        return this.for_sale;
    }

    toString() {
        return `Menu Part ID: ${this.menu_part_id}, Part Name: ${this.part_name}, Image Name: ${this.image_name}, Price: $${this.price.toFixed(2)}, For Sale: ${this.for_sale}`;
    }

    toJSON() {
        return {
            menu_part_id: this.menu_part_id,
            part_name: this.part_name,
            image_name: this.image_name,
            price: this.price,
            for_sale: this.for_sale,
        };
    }
}

module.exports = MenuPart;
