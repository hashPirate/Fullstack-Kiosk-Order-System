const DatabaseEntry = require('./DatabaseEntry');
const crypto = require('crypto');

class POSUser extends DatabaseEntry {
    constructor(db, result) {
        super(db, result);
    }

    updateFromResultSet(result) {
        this.user_id = result.user_id;
        this.username = result.username;
        this.password_hash = result.password_hash;
        this.is_manager = result.is_manager;
        this.on_staff = result.on_staff;
    }

    getPrimaryKeyValue() {
        return this.user_id;
    }

    static hashPassword(password) {
        const hash = crypto.createHash('sha256');
        hash.update(password);
        return hash.digest('hex');
    }

    getUserId() {
        return this.user_id;
    }

    getUsername() {
        return this.username;
    }

    passwordMatches(password) {
        return this.password_hash === POSUser.hashPassword(password);
    }

    getIsManager() {
        return this.is_manager;
    }

    getOnStaff() {
        return this.on_staff;
    }

    toString() {
        return `User ID: ${this.user_id}, Username: ${this.username}, Password Hash: ${this.password_hash}, Is Manager: ${this.is_manager}, On Staff: ${this.on_staff}`;
    }

    toJSON() {
        return {
            user_id: this.user_id,
            username: this.username,
            password_hash: this.password_hash,
            is_manager: this.is_manager,
            on_staff: this.on_staff,
        };
    }
}

module.exports = POSUser;
