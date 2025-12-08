/**
 * @module model
 */
const DatabaseEntry = require('./DatabaseEntry');

/**
 * Represents hourly sales data.
 * @class HourlySales
 * @extends DatabaseEntry
 * @param {object} db - The database connection object.
 * @param {object} result - The raw data from the database.
 * @property {number} hour The hour of the sales data (0-23).
 * @property {number} totalSales The total sales for the hour.
 */
class HourlySales extends DatabaseEntry {
    constructor(db, result) {
        super(db, result);
    }

    /**
     * Updates the model's properties from a raw database result set.
     * @param {object} result - The raw database result.
     */
    updateFromResultSet(result) {
        this.hour = result.hour;
        this.totalSales = result.total_sales;
    }

    /**
     * Gets the primary key value. Returns null as this is a report model.
     * @returns {null}
     */
    getPrimaryKeyValue() {
        return null;
    }

    /**
     * Gets the hour of the sales data.
     * @returns {number} The hour (0-23).
     */
    getHour() {
        return this.hour;
    }

    /**
     * Gets the total sales for the hour.
     * @returns {number} The total sales amount.
     */
    getTotalSales() {
        return this.totalSales;
    }

    /**
     * Returns a string representation of the hourly sales.
     * @returns {string}
     */
    toString() {
        return `${String(this.hour).padStart(2, '0')}:00 - $${this.totalSales.toFixed(2)}`;
    }

    /**
     * Returns a JSON-serializable representation of the hourly sales.
     * @returns {object}
     */
    toJSON() {
        return {
            hour: this.hour,
            totalSales: this.totalSales,
        };
    }
}

module.exports = HourlySales;
