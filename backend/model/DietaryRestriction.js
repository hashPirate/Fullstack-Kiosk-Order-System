/**
 * @module model
 */

/**
 * Represents a dietary restriction.
 * @class DietaryRestriction
 * @param {object} db - The database connection object.
 * @param {object} data - The raw data from the database.
 * @property {object} db The database connection object.
 * @property {number} dietary_restriction_id The ID of the dietary restriction.
 * @property {string} dietary_restriction_name The name of the dietary restriction.
 */
class DietaryRestriction {
    constructor(db, data) {
        this.db = db;
        this.dietary_restriction_id = data.dietary_restriction_id;
        this.dietary_restriction_name = data.dietary_restriction_name;
    }

    /**
     * Gets the ID of the dietary restriction.
     * @returns {number} The restriction ID.
     */
    getRestrictionId() {
        return this.dietary_restriction_id;
    }

    /**
     * Returns a JSON-serializable representation of the dietary restriction.
     * @returns {object}
     */
    toJSON() {
        return {
            dietary_restriction_id: this.dietary_restriction_id,
            dietary_restriction_name: this.dietary_restriction_name,
        };
    }
}

module.exports = DietaryRestriction;