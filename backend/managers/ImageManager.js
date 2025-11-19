const DbModelManager = require('./DbModelManager');

class ImageManager extends DbModelManager {
    constructor(db) {
        super(db);
    }

    async getImageByName(imageName) {
        const result = await this.db.query('SELECT image_data FROM images WHERE LOWER(image_name) = LOWER($1)', [imageName]);
        if (result.rows.length === 0) {
            return null;
        }
        const data = result.rows[0].image_data;
        return data;
    }

    async createOrReplaceImage(imageName, imageData) {
        await this.db.query('INSERT INTO images (image_name, image_data) VALUES ($1, $2) ON CONFLICT (image_name) DO UPDATE SET image_data = $2', [imageName, imageData]);
    }
}

module.exports = ImageManager;
