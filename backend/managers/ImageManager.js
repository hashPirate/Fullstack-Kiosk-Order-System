/**
 * @module manager
 */
const DbModelManager = require('./DbModelManager');

/**
 * Manages images in the database.
 * @class ImageManager
 * @extends DbModelManager
 * @param {object} db - The database connection object.
 */
class ImageManager extends DbModelManager {
    constructor(db) {
        super(db);
    }

    /**
     * Retrieves an image by its name.
     * @param {string} imageName - The name of the image.
     * @returns {Promise<Buffer|null>} The image data as a Buffer, or null if not found.
     */
    async getImageByName(imageName) {
        const result = await this.db.query('SELECT image_data FROM images WHERE LOWER(image_name) = LOWER($1)', [imageName]);
        if (result.rows.length === 0) {
            return null;
        }
        const data = result.rows[0].image_data;
        return data;
    }

    /**
     * Creates a new image or replaces an existing one.
     * @param {string} imageName - The name of the image.
     * @param {Buffer} imageData - The image data.
     */
    async createOrReplaceImage(imageName, imageData) {
        await this.db.query('INSERT INTO images (image_name, image_data) VALUES ($1, $2) ON CONFLICT (image_name) DO UPDATE SET image_data = $2', [imageName, imageData]);
    }
}

module.exports = ImageManager;
