class DatabaseEntry {
    constructor(db, result) {
        this.db = db;
        if (result) {
            this.updateFromResultSet(result);
        }
    }

    getPrimaryKeyValue() {
        throw new Error('getPrimaryKeyValue() must be implemented by subclass');
    }

    updateFromResultSet(result) {
        throw new Error('updateFromResultSet() must be implemented by subclass');
    }

    toString() {
        throw new Error('toString() must be implemented by subclass');
    }

    toJSON() {
        throw new Error('toJSON() must be implemented by subclass');
    }
}

module.exports = DatabaseEntry;
