/**
 * @module controllers/images
 */
const express = require('express');
const router = express.Router();
const db = require('../database');

/**
 * Route to upload or replace an image.
 * @name post/:imageName/upload
 * @function
 * @param {string} imageName - The name of the image to upload.
 * @param {Buffer} - The raw image data in the request body.
 */
router.post('/:imageName/upload', async (req, res) => {
    try {
        const { imageName } = req.params;
        const imageData = req.body;
        await db.imageManager.createOrReplaceImage(imageName, imageData);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to retrieve an image by its name.
 * @name get/:imageName
 * @function
 * @param {string} imageName - The name of the image to retrieve.
 */
router.get('/:imageName', async (req, res) => {
    try {
        const { imageName } = req.params;
        const imageData = await db.imageManager.getImageByName(imageName);
        if (imageData === null) {
            return res.status(404).json({ error: 'Image not found' });
        }

        var contentType = 'image/jpeg';
        if (imageName.endsWith(".png")) {
            contentType = 'image/png';
        }
        res.status(200).header('Content-Type', contentType).send(imageData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
