/**
 * @module model
 */
const DatabaseEntry = require('./DatabaseEntry');

/**
 * Represents a sales report for a single item.
 * @class ItemSalesReport
 * @extends DatabaseEntry
 * @param {object} db - The database connection object.
 * @param {object} result - The raw data from the database.
 * @property {number} menuItemId The ID of the menu item.
 * @property {string} itemName The name of the item.
 * @property {number} totalQuantity The total quantity sold.
 * @property {number} totalSales The total sales amount for the item.
 * @property {number} averagePrice The average price of the item.
 */
class ItemSalesReport extends DatabaseEntry {
    constructor(db, result) {
        super(db, result);
    }

    /**
     * Updates the model's properties from a raw database result set.
     * @param {object} result - The raw database result.
     */
    updateFromResultSet(result) {
        this.menuItemId = result.menuitemid;
        this.itemName = result.itemname;
        this.totalQuantity = result.totalquantity;
        this.totalSales = result.totalsales;
        this.averagePrice = result.averageprice;
    }

    /**
     * Gets the primary key value. Returns null as this is a report model.
     * @returns {null}
     */
    getPrimaryKeyValue() {
        return null;
    }

    /**
     * Gets the menu item ID.
     * @returns {number}
     */
    getMenuItemId() {
        return this.menuItemId;
    }

    /**
     * Gets the item name.
     * @returns {string}
     */
    getItemName() {
        return this.itemName;
    }

    /**
     * Gets the total quantity sold.
     * @returns {number}
     */
    getTotalQuantity() {
        return this.totalQuantity;
    }

    /**
     * Gets the total sales amount.
     * @returns {number}
     */
    getTotalSales() {
        return this.totalSales;
    }

    /**
     * Gets the average price of the item.
     * @returns {number}
     */
    getAveragePrice() {
        return this.averagePrice;
    }

    /**
     * Returns a string representation of the item sales report.
     * @returns {string}
     */
    toString() {
        return `Item: ${this.itemName} (id=${this.menuItemId}) - Qty: ${this.totalQuantity} - Sales: $${this.totalSales.toFixed(2)} - Avg: $${this.averagePrice.toFixed(2)}`;
    }

    /**
     * Returns a JSON-serializable representation of the item sales report.
     * @returns {object}
     */
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
