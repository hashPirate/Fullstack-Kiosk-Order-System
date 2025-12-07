const DbModelManager = require('./DbModelManager');
const DietaryRestriction = require('../model/DietaryRestriction');

class DietaryRestrictionManager extends DbModelManager {
    constructor(db) {
        super(db);
    }

    async getAll() {
        const result = await this.db.query('SELECT * FROM dietary_restrictions ORDER BY dietary_restriction_name');
        return result.rows.map(row => new DietaryRestriction(this.db, row));
    }

    async getById(id) {
        const result = await this.db.query('SELECT * FROM dietary_restrictions WHERE dietary_restriction_id = $1', [id]);
        if (result.rows.length === 0) return null;
        return new DietaryRestriction(this.db, result.rows[0]);
    }

    async create(name) {
        const result = await this.db.query('INSERT INTO dietary_restrictions (dietary_restriction_name) VALUES ($1) RETURNING *', [name]);
        return new DietaryRestriction(this.db, result.rows[0]);
    }

    async delete(id) {
        await this.db.query('DELETE FROM dietary_restrictions WHERE dietary_restriction_id = $1', [id]);
    }
}

module.exports = DietaryRestrictionManager;