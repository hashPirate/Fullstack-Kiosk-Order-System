/**
 * @module model
 */

/**
 * Abstract base class for database model entries.
 * @abstract
 * @class DatabaseEntry
 * @param {object} db - The database connection object.
 * @param {object} [result] - The raw database result to populate the model.
 * @property {object} db The database connection object.
 */
class DatabaseEntry {
    constructor(db, result) {
        this.db = db;
        if (result) {
            this.updateFromResultSet(result);
        }
    }
    /**
     * Gets the primary key value for this entry.
     * @abstract
     * @returns {*} The primary key value.
     */
    getPrimaryKeyValue() {
        throw new Error('getPrimaryKeyValue() must be implemented by subclass');
    }
    /**
     * Updates the model's properties from a raw database result set.
     * @abstract
     * @param {object} result - The raw database result.
     */
    updateFromResultSet(result) {
        throw new Error('updateFromResultSet() must be implemented by subclass');
    }
    /**
     * Returns a string representation of the model.
     * @abstract
     * @returns {string}
     */
    toString() {
        throw new Error('toString() must be implemented by subclass');
    }
    /**
     * Returns a JSON-serializable representation of the model.
     * @abstract
     * @returns {object}
     */
    toJSON() {
        throw new Error('toJSON() must be implemented by subclass');
    }
}

module.exports = DatabaseEntry;
