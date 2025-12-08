class DietaryRestriction {
    constructor(db, data) {
        this.db = db;
        this.dietary_restriction_id = data.dietary_restriction_id;
        this.dietary_restriction_name = data.dietary_restriction_name;
    }

    getRestrictionId() {
        return this.dietary_restriction_id;
    }

    toJSON() {
        return {
            dietary_restriction_id: this.dietary_restriction_id,
            dietary_restriction_name: this.dietary_restriction_name,
        };
    }
}

module.exports = DietaryRestriction;