const crypto = require('crypto');

class User {
    constructor(db, data) {
        this.db = db;
        this.user_id = data.user_id;
        this.username = data.username;
        this.password_hash = data.password_hash;
        this.scopes = data.scopes || [];
        this.on_staff = data.on_staff;
        this.gaia_id = data.gaia_id;
    }

    getUserId() {
        return this.user_id;
    }

    hasScope(scope) {
        return this.scopes.includes(scope);
    }

    isManager() {
        return this.hasScope('manager');
    }

    passwordMatches(password) {
        if (!password || !this.password_hash) {
            return false;
        }
        return this.password_hash === User.hashPassword(password);
    }

    static hashPassword(password) {
        if (!password) {
            return null;
        }
        const hash = crypto.createHash('sha256');
        hash.update(password);
        return hash.digest('hex');
    }


    toString() {
        return `User ID: ${this.user_id}, Username: ${this.username}, Password Hash: ${this.password_hash}, Scopes: ${this.scopes}, On Staff: ${this.on_staff}, Gaia ID: ${this.gaia_id}`;
    }

    toJSON() {
        return {
            user_id: this.user_id,
            username: this.username,
            password_hash: this.password_hash,
            scopes: this.scopes,
            on_staff: this.on_staff,
            gaia_id: this.gaia_id,
        };
    }
}

module.exports = User;