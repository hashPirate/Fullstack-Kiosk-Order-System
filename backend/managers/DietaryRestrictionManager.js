/**
 * @module manager
 */
const DbModelManager = require('./DbModelManager');
const DietaryRestriction = require('../model/DietaryRestriction');

/**
 * Manages dietary restrictions in the database.
 * @class DietaryRestrictionManager
 * @extends DbModelManager
 * @param {object} db - The database connection object.
 */
class DietaryRestrictionManager extends DbModelManager {
    constructor(db) {
        super(db);
    }

    /**
     * Retrieves all dietary restrictions.
     * @returns {Promise<DietaryRestriction[]>} A list of all dietary restrictions.
     */
    async getAll() {
        const result = await this.db.query('SELECT * FROM dietary_restrictions ORDER BY dietary_restriction_name');
        return result.rows.map(row => new DietaryRestriction(this.db, row));
    }

    /**
     * Retrieves a dietary restriction by its ID.
     * @param {number} id - The ID of the dietary restriction.
     * @returns {Promise<DietaryRestriction|null>} The dietary restriction object, or null if not found.
     */
    async getById(id) {
        const result = await this.db.query('SELECT * FROM dietary_restrictions WHERE dietary_restriction_id = $1', [id]);
        if (result.rows.length === 0) return null;
        return new DietaryRestriction(this.db, result.rows[0]);
    }

    /**
     * Creates a new dietary restriction.
     * @param {string} name - The name of the dietary restriction.
     * @returns {Promise<DietaryRestriction>} The newly created dietary restriction.
     */
    async create(name) {
        const result = await this.db.query('INSERT INTO dietary_restrictions (dietary_restriction_name) VALUES ($1) RETURNING *', [name]);
        return new DietaryRestriction(this.db, result.rows[0]);
    }

    /**
     * Deletes a dietary restriction by its ID.
     * @param {number} id - The ID of the dietary restriction to delete.
     */
    async delete(id) {
        await this.db.query('DELETE FROM dietary_restrictions WHERE dietary_restriction_id = $1', [id]);
    }
}

module.exports = DietaryRestrictionManager;