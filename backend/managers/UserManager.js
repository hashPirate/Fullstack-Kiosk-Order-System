const DbModelManager = require('./DbModelManager');
const User = require('../model/User');
const DietaryRestriction = require('../model/DietaryRestriction');

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

    async findOrCreateFromGoogleProfile(profile, email) {
        const existingUser = await this.getUserByGaiaId(profile.id);
        if (existingUser) {
            if (email && existingUser.email !== email) {
                await this.setEmail(existingUser, email);
                // Re-fetch user to get the updated email
                return this.getUserById(existingUser.getUserId());
            }
            return existingUser;
        }

        const result = await this.db.query('INSERT INTO users (username, scopes, on_staff, gaia_id, email) VALUES ($1, $2, $3, $4, $5) RETURNING *', [profile.displayName, [], true, profile.id, email]);
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

    async setCashier(user, isCashier) {
        if (isCashier) {
            await this.db.query("UPDATE users SET scopes = array_append(scopes, 'cashier') WHERE user_id = $1 AND NOT ('cashier' = ANY(scopes))", [user.getUserId()]);
        } else {
            await this.db.query("UPDATE users SET scopes = array_remove(scopes, 'cashier') WHERE user_id = $1", [user.getUserId()]);
        }
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
    
    async setLanguage(userId, language) {
        await this.db.query('UPDATE users SET user_language = $1 WHERE user_id = $2', [language, userId]);
    }

    async setEmail(user, email) {
        await this.db.query('UPDATE users SET email = $1 WHERE user_id = $2', [email, user.getUserId()]);
    }

    async getDietaryRestrictions(user) {
        const query = `
            SELECT dr.* FROM dietary_restrictions dr
            JOIN user_dietary_restrictions udr ON dr.dietary_restriction_id = udr.dietary_restriction_id
            WHERE udr.user_id = $1
            ORDER BY dr.dietary_restriction_name;
        `;
        const result = await this.db.query(query, [user.getUserId()]);
        return result.rows.map(row => new DietaryRestriction(this.db, row));
    }

    async addDietaryRestriction(user, restrictionId) {
        const query = 'INSERT INTO user_dietary_restrictions (user_id, dietary_restriction_id) VALUES ($1, $2) ON CONFLICT DO NOTHING';
        await this.db.query(query, [user.getUserId(), restrictionId]);
    }

    async removeDietaryRestriction(user, restrictionId) {
        const query = 'DELETE FROM user_dietary_restrictions WHERE user_id = $1 AND dietary_restriction_id = $2';
        await this.db.query(query, [user.getUserId(), restrictionId]);
    }
}

module.exports = UserManager;
