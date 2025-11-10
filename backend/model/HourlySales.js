const DatabaseEntry = require('./DatabaseEntry');

class HourlySales extends DatabaseEntry {
    constructor(db, result) {
        super(db, result);
    }

    updateFromResultSet(result) {
        this.hour = result.hour;
        this.totalSales = result.total_sales;
    }

    getPrimaryKeyValue() {
        return null;
    }

    getHour() {
        return this.hour;
    }

    getTotalSales() {
        return this.totalSales;
    }

    toString() {
        return `${String(this.hour).padStart(2, '0')}:00 - $${this.totalSales.toFixed(2)}`;
    }

    toJSON() {
        return {
            hour: this.hour,
            totalSales: this.totalSales,
        };
    }
}

module.exports = HourlySales;
