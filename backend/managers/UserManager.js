/**
 * @module manager
 */
const DbModelManager = require('./DbModelManager');
const User = require('../model/User');
const DietaryRestriction = require('../model/DietaryRestriction');

/**
 * Manages users in the database.
 * @class UserManager
 * @extends DbModelManager
 * @param {object} db - The database connection object.
 */
class UserManager extends DbModelManager {
    constructor(db) {
        super(db);
    }

    /**
     * Retrieves a user by their username.
     * @param {string} username - The username.
     * @returns {Promise<User|null>} The user object, or null if not found.
     */
    async getUser(username) {
        const result = await this.db.query('SELECT * FROM users WHERE LOWER(username) = LOWER($1)', [username]);
        if (result.rows.length === 0) {
            return null;
        }
        return new User(this.db, result.rows[0]);
    }

    /**
     * Retrieves a user by their ID.
     * @param {number} userId - The user's ID.
     * @returns {Promise<User|null>} The user object, or null if not found.
     */
    async getUserById(userId) {
        const result = await this.db.query('SELECT * FROM users WHERE user_id = $1', [userId]);
        if (result.rows.length === 0) {
            return null;
        }
        return new User(this.db, result.rows[0]);
    }

    /**
     * Retrieves a user by their Google ID (gaia_id).
     * @param {string} gaiaId - The user's Google ID.
     * @returns {Promise<User|null>} The user object, or null if not found.
     */
    async getUserByGaiaId(gaiaId) {
        const result = await this.db.query('SELECT * FROM users WHERE gaia_id = $1', [gaiaId]);
        if (result.rows.length === 0) {
            return null;
        }
        return new User(this.db, result.rows[0]);
    }

    /**
     * Retrieves all users.
     * @returns {Promise<User[]>} A list of all users.
     */
    async getAllUsers() {
        const result = await this.db.query('SELECT * FROM users ORDER BY user_id');
        return result.rows.map(row => new User(this.db, row));
    }

    /**
     * Creates a new user with a username and password.
     * @param {string} username - The username.
     * @param {string} password - The password.
     * @returns {Promise<User|null>} The newly created user, or null on failure.
     */
    async createUser(username, password) {
        const passwordHash = User.hashPassword(password);
        
        const result = await this.db.query('INSERT INTO users (username, password_hash, scopes) VALUES ($1, $2, $3) RETURNING *', [username.toLowerCase(), passwordHash, []]);
        if (result.rows.length === 0) {
            return null;
        }
        return new User(this.db, result.rows[0]);
    }

    /**
     * Finds an existing user or creates a new one from a Google profile.
     * @param {object} profile - The Google profile object.
     * @param {string} email - The user's email.
     * @returns {Promise<User>} The existing or newly created user.
     */
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

    /**
     * Deletes a user.
     * @param {User} user - The user to delete.
     */
    async deleteUser(user) {
        await this.db.query('DELETE FROM users WHERE user_id = $1', [user.getUserId()]);
    }

    /**
     * Sets a user's password.
     * @param {User} user - The user to update.
     * @param {string} password - The new password.
     */
    async setPassword(user, password) {
        const passwordHash = User.hashPassword(password);
        await this.db.query('UPDATE users SET password_hash = $1 WHERE user_id = $2', [passwordHash, user.getUserId()]);
    }

    /**
     * Sets a user's username.
     * @param {User} user - The user to update.
     * @param {string} username - The new username.
     */
    async setUsername(user, username) {
        await this.db.query('UPDATE users SET username = $1 WHERE user_id = $2', [username.toLowerCase(), user.getUserId()]);
    }

    /**
     * Sets a user's cashier role.
     * @param {User} user - The user to update.
     * @param {boolean} isCashier - True to add the cashier role, false to remove it.
     */
    async setCashier(user, isCashier) {
        if (isCashier) {
            await this.db.query("UPDATE users SET scopes = array_append(scopes, 'cashier') WHERE user_id = $1 AND NOT ('cashier' = ANY(scopes))", [user.getUserId()]);
        } else {
            await this.db.query("UPDATE users SET scopes = array_remove(scopes, 'cashier') WHERE user_id = $1", [user.getUserId()]);
        }
    }

    /**
     * Sets a user's manager role.
     * @param {User} user - The user to update.
     * @param {boolean} isManager - True to add the manager role, false to remove it.
     */
    async setManager(user, isManager) {
        if (isManager) {
            await this.db.query("UPDATE users SET scopes = array_append(scopes, 'manager') WHERE user_id = $1 AND NOT ('manager' = ANY(scopes))", [user.getUserId()]);
        } else {
            await this.db.query("UPDATE users SET scopes = array_remove(scopes, 'manager') WHERE user_id = $1", [user.getUserId()]);
        }
    }

    /**
     * Sets a user's on-staff status.
     * @param {User} user - The user to update.
     * @param {boolean} onStaff - The new on-staff status.
     */
    async setOnStaff(user, onStaff) {
        await this.db.query('UPDATE users SET on_staff = $1 WHERE user_id = $2', [onStaff, user.getUserId()]);
    }
    
    /**
     * Sets a user's language preference.
     * @param {number} userId - The ID of the user.
     * @param {string} language - The language code (e.g., 'en', 'es').
     */
    async setLanguage(userId, language) {
        await this.db.query('UPDATE users SET user_language = $1 WHERE user_id = $2', [language, userId]);
    }

    /**
     * Sets a user's email address.
     * @param {User} user - The user to update.
     * @param {string} email - The new email address.
     */
    async setEmail(user, email) {
        await this.db.query('UPDATE users SET email = $1 WHERE user_id = $2', [email, user.getUserId()]);
    }

    /**
     * Retrieves the dietary restrictions for a user.
     * @param {User} user - The user.
     * @returns {Promise<DietaryRestriction[]>} A list of dietary restrictions.
     */
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

    /**
     * Adds a dietary restriction to a user.
     * @param {User} user - The user.
     * @param {number} restrictionId - The ID of the restriction to add.
     */
    async addDietaryRestriction(user, restrictionId) {
        const query = 'INSERT INTO user_dietary_restrictions (user_id, dietary_restriction_id) VALUES ($1, $2) ON CONFLICT DO NOTHING';
        await this.db.query(query, [user.getUserId(), restrictionId]);
    }

    /**
     * Removes a dietary restriction from a user.
     * @param {User} user - The user.
     * @param {number} restrictionId - The ID of the restriction to remove.
     */
    async removeDietaryRestriction(user, restrictionId) {
        const query = 'DELETE FROM user_dietary_restrictions WHERE user_id = $1 AND dietary_restriction_id = $2';
        await this.db.query(query, [user.getUserId(), restrictionId]);
    }
}

module.exports = UserManager;
