/**
 * @module model
 */
const crypto = require('crypto');

/**
 * Represents a user.
 * @class User
 * @param {object} db - The database connection object.
 * @param {object} data - The raw data from the database.
 * @property {object} db The database connection object.
 * @property {number} user_id The ID of the user.
 * @property {string} username The user's username.
 * @property {string} password_hash The user's hashed password.
 * @property {string[]} scopes The user's roles/permissions.
 * @property {boolean} on_staff Whether the user is currently on staff.
 * @property {string} gaia_id The user's Google ID.
 * @property {string} email The user's email address.
 * @property {string} user_language The user's preferred language.
 */
class User {
    constructor(db, data) {
        this.db = db;
        this.user_id = data.user_id;
        this.username = data.username;
        this.password_hash = data.password_hash;
        this.scopes = data.scopes || [];
        this.on_staff = data.on_staff;
        this.gaia_id = data.gaia_id;
        this.email = data.email;
        this.user_language = data.user_language;
    }

    /**
     * Gets the primary key value for this entry.
     * @returns {number} The user ID.
     */
    getPrimaryKeyValue() {
        return this.user_id;
    }

    /**
     * Gets the user's ID.
     * @returns {number}
     */
    getUserId() {
        return this.user_id;
    }

    /**
     * Checks if the user has a specific scope (role).
     * @param {string} scope - The scope to check for.
     * @returns {boolean}
     */
    hasScope(scope) {
        return this.scopes.includes(scope);
    }

    /**
     * Checks if the user is a manager.
     * @returns {boolean}
     */
    isManager() {
        return this.hasScope('manager');
    }

    /**
     * Checks if the provided password matches the user's stored password hash.
     * @param {string} password - The password to check.
     * @returns {boolean}
     */
    passwordMatches(password) {
        if (!password || !this.password_hash) {
            return false;
        }
        return this.password_hash === User.hashPassword(password);
    }

    /**
     * Hashes a password using SHA256.
     * @static
     * @param {string} password - The password to hash.
     * @returns {string|null} The hashed password, or null if no password was provided.
     */
    static hashPassword(password) {
        if (!password) {
            return null;
        }
        const hash = crypto.createHash('sha256');
        hash.update(password);
        return hash.digest('hex');
    }

    /**
     * Sets the user's email address.
     * @param {string} email - The new email address.
     */
    async setEmail(email) {
        await this.db.userManager.setEmail(this, email);
        this.email = email;
    }

    /**
     * Retrieves the dietary restrictions for the user.
     * @returns {Promise<DietaryRestriction[]>}
     */
    async getDietaryRestrictions() {
        return this.db.userManager.getDietaryRestrictions(this);
    }

    /**
     * Returns a string representation of the user.
     * @returns {string}
     */
    toString() {
        return `User ID: ${this.user_id}, Username: ${this.username}, Password Hash: ${this.password_hash}, Scopes: ${this.scopes}, On Staff: ${this.on_staff}, Gaia ID: ${this.gaia_id}`;
    }

    /**
     * Returns a JSON-serializable representation of the user.
     * @returns {object}
     */
    toJSON() {
        return {
            user_id: this.user_id,
            username: this.username,
            password_hash: this.password_hash,
            scopes: this.scopes,
            on_staff: this.on_staff,
            gaia_id: this.gaia_id,
            email: this.email,
            user_language: this.user_language,
        };
    }
}

module.exports = User;