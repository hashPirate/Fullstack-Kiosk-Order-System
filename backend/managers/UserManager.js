const DbModelManager = require('./DbModelManager');
const User = require('../model/User');

class UserManager extends DbModelManager {
    constructor(db) {
        super(db);
    }

    async getUser(username) {
        const result = await this.db.query('SELECT * FROM users WHERE LOWER(username) = LOWER($1)', [username]);
        if (result.rows.length === 0) {
            return null;
        }
        return new User(this.db, result.rows[0]);
    }

    async getUserById(userId) {
        const result = await this.db.query('SELECT * FROM users WHERE user_id = $1', [userId]);
        if (result.rows.length === 0) {
            return null;
        }
        return new User(this.db, result.rows[0]);
    }

    async getUserByGaiaId(gaiaId) {
        const result = await this.db.query('SELECT * FROM users WHERE gaia_id = $1', [gaiaId]);
        if (result.rows.length === 0) {
            return null;
        }
        return new User(this.db, result.rows[0]);
    }

    async getAllUsers() {
        const result = await this.db.query('SELECT * FROM users ORDER BY user_id');
        return result.rows.map(row => new User(this.db, row));
    }

    async createUser(username, password) {
        const passwordHash = User.hashPassword(password);
        
        const result = await this.db.query('INSERT INTO users (username, password_hash, scopes) VALUES ($1, $2, $3) RETURNING *', [username.toLowerCase(), passwordHash, []]);
        if (result.rows.length === 0) {
            return null;
        }
        return new User(this.db, result.rows[0]);
    }

    async findOrCreateFromGoogleProfile(profile) {
        const existingUser = await this.getUserByGaiaId(profile.id);
        if (existingUser) {
            return existingUser;
        }

        const result = await this.db.query('INSERT INTO users (username, scopes, on_staff, gaia_id) VALUES ($1, $2, $3, $4) RETURNING *', [profile.displayName, ['cashier'], true, profile.id]);
        return new User(this.db, result.rows[0]);
    }

    async deleteUser(user) {
        await this.db.query('DELETE FROM users WHERE user_id = $1', [user.getUserId()]);
    }

    async setPassword(user, password) {
        const passwordHash = User.hashPassword(password);
        await this.db.query('UPDATE users SET password_hash = $1 WHERE user_id = $2', [passwordHash, user.getUserId()]);
    }

    async setUsername(user, username) {
        await this.db.query('UPDATE users SET username = $1 WHERE user_id = $2', [username.toLowerCase(), user.getUserId()]);
    }

    async setManager(user, isManager) {
        if (isManager) {
            await this.db.query("UPDATE users SET scopes = array_append(scopes, 'manager') WHERE user_id = $1 AND NOT ('manager' = ANY(scopes))", [user.getUserId()]);
        } else {
            await this.db.query("UPDATE users SET scopes = array_remove(scopes, 'manager') WHERE user_id = $1", [user.getUserId()]);
        }
    }

    async setOnStaff(user, onStaff) {
        await this.db.query('UPDATE users SET on_staff = $1 WHERE user_id = $2', [onStaff, user.getUserId()]);
    }
}

module.exports = UserManager;
