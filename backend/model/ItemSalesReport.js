const DatabaseEntry = require('./DatabaseEntry');

class ItemSalesReport extends DatabaseEntry {
    constructor(db, result) {
        super(db, result);
    }

    updateFromResultSet(result) {
        this.menuItemId = result.menuitemid;
        this.itemName = result.itemname;
        this.totalQuantity = result.totalquantity;
        this.totalSales = result.totalsales;
        this.averagePrice = result.averageprice;
    }

    getPrimaryKeyValue() {
        return null;
    }

    getMenuItemId() {
        return this.menuItemId;
    }

    getItemName() {
        return this.itemName;
    }

    getTotalQuantity() {
        return this.totalQuantity;
    }

    getTotalSales() {
        return this.totalSales;
    }

    getAveragePrice() {
        return this.averagePrice;
    }

    toString() {
        return `Item: ${this.itemName} (id=${this.menuItemId}) - Qty: ${this.totalQuantity} - Sales: $${this.totalSales.toFixed(2)} - Avg: $${this.averagePrice.toFixed(2)}`;
    }

    toJSON() {
        return {
            menuItemId: this.menuItemId,
            itemName: this.itemName,
            totalQuantity: this.totalQuantity,
            totalSales: this.totalSales,
            averagePrice: this.averagePrice,
        };
    }
}

module.exports = ItemSalesReport;
