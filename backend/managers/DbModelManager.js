/**
 * @module manager
 */

/**
 * Base class for database model managers.
 * @class
 */
class DbModelManager {
    /**
     * @param {object} db - The database connection object.
     */
    constructor(db) {
        this.db = db;
    }
}

module.exports = DbModelManager;
