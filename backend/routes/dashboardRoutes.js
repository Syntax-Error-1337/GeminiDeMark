const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const ConversionLog = require('../models/ConversionLog');

const ConversionImage = require('../models/ConversionImage');
const path = require('path');
const fs = require('fs');

// Define associations if not already defined globally
ConversionLog.hasOne(ConversionImage, { foreignKey: 'logId' });
ConversionImage.belongsTo(ConversionLog, { foreignKey: 'logId' });

// Get user's conversion history
router.get('/history', authMiddleware.verifyToken, async (req, res) => {
    try {
        const history = await ConversionLog.findAll({
            where: { userId: req.userId },
            include: [{ model: ConversionImage }],
            order: [['timestamp', 'DESC']]
        });
        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ message: 'Error fetching conversion history' });
    }
});

// Serve images securely
router.get('/image/:id/:type', authMiddleware.verifyToken, async (req, res) => {
    try {
        const { id, type } = req.params; // id is conversionLog ID, type is 'original' or 'processed'

        const log = await ConversionLog.findOne({
            where: { id: id, userId: req.userId },
            include: [{ model: ConversionImage }]
        });

        if (!log || !log.ConversionImage) {
            return res.status(404).send('Image record not found or access denied.');
        }

        let filePath;
        if (type === 'original') {
            filePath = log.ConversionImage.originalPath;
        } else if (type === 'processed') {
            filePath = log.ConversionImage.processedPath;
        } else {
            return res.status(400).send('Invalid image type.');
        }

        // Paths in DB are relative to 'storage' or absolute? 
        // Based on userController.js: 
        // originalRelPath = path.join(userFolder, 'original', originalFilename);
        // processedRelPath = path.join(userFolder, 'converted', processedFilename);
        // And they are stored in ../storage

        // Construct absolute path
        const absolutePath = path.join(__dirname, '../storage', filePath);

        if (!fs.existsSync(absolutePath)) {
            return res.status(404).send('File not found on server.');
        }

        res.sendFile(absolutePath);

    } catch (error) {
        console.error('Error serving image:', error);
        res.status(500).send('Error retrieving image.');
    }
});

module.exports = router;
