const DbModelManager = require('./DbModelManager');
const POSUser = require('../model/POSUser');

class POSUserManager extends DbModelManager {
    constructor(db) {
        super(db);
    }

    async getUser(username) {
        const result = await this.db.query('SELECT * FROM pos_users WHERE LOWER(username) = LOWER($1)', [username]);
        if (result.rows.length === 0) {
            return null;
        }
        return new POSUser(this.db, result.rows[0]);
    }

    async getAllUsers() {
        const result = await this.db.query('SELECT * FROM pos_users');
        return result.rows.map(row => new POSUser(this.db, row));
    }

    async createUser(username, password) {
        const passwordHash = POSUser.hashPassword(password);
        const result = await this.db.query('INSERT INTO pos_users (username, password_hash) VALUES ($1, $2) RETURNING *', [username.toLowerCase(), passwordHash]);
        if (result.rows.length === 0) {
            return null;
        }
        return new POSUser(this.db, result.rows[0]);
    }

    async deleteUser(user) {
        await this.db.query('DELETE FROM pos_users WHERE user_id = $1', [user.getUserId()]);
    }

    async setPassword(user, password) {
        const passwordHash = POSUser.hashPassword(password);
        await this.db.query('UPDATE pos_users SET password_hash = $1 WHERE user_id = $2', [passwordHash, user.getUserId()]);
    }

    async setUsername(user, username) {
        await this.db.query('UPDATE pos_users SET username = $1 WHERE user_id = $2', [username.toLowerCase(), user.getUserId()]);
    }

    async setManager(user, isManager) {
        await this.db.query('UPDATE pos_users SET is_manager = $1 WHERE user_id = $2', [isManager, user.getUserId()]);
    }

    async setOnStaff(user, onStaff) {
        await this.db.query('UPDATE pos_users SET on_staff = $1 WHERE user_id = $2', [onStaff, user.getUserId()]);
    }
}

module.exports = POSUserManager;
