const User = require('../models/User');
const ConversionLog = require('../models/ConversionLog');
const ConversionImage = require('../models/ConversionImage');

exports.getDashboard = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, {
            attributes: ['id', 'username', 'email', 'role', 'isVerified', 'monthlyUsage', 'monthlyLimit', 'createdAt']
        });

        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.trackUsage = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);

        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }

        // Check for Monthly Reset
        const now = new Date();
        const lastReset = new Date(user.lastUsageReset);
        const oneMonth = 30 * 24 * 60 * 60 * 1000; // Approx

        if (now - lastReset > oneMonth) {
            user.monthlyUsage = 0;
            user.lastUsageReset = now;
        }

        // Check limit
        if (user.monthlyUsage >= user.monthlyLimit) {
            console.log(`[TrackUsage] Limit reached for user ${req.userId}`);
            return res.status(403).send({ message: 'Monthly limit reached (20 images). Upgrade plan for more.' });
        }

        console.log(`[TrackUsage] Before update: User ${req.userId}, Usage: ${user.monthlyUsage}`);
        user.monthlyUsage += 1;
        await user.save();
        console.log(`[TrackUsage] After update: User ${req.userId}, Usage: ${user.monthlyUsage}`);

        // Log Conversion
        if (req.body.imageData) {
            try {
                // Remove data:image/png;base64, prefix if present
                const base64Data = req.body.imageData.replace(/^data:image\/\w+;base64,/, "");
                const imageBuffer = Buffer.from(base64Data, 'base64');

                // 1. Create Log Metadata
                const log = await ConversionLog.create({
                    userId: req.userId,
                    ipAddress: req.ip || req.connection.remoteAddress,
                    userAgent: req.get('User-Agent'),
                    fileSize: imageBuffer.length
                });

                // 2. Store Images on Disk
                const fs = require('fs');
                const path = require('path');

                // Sanitized Username Folder
                const sanitizedUsername = user.username.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                const userFolder = `user_${req.userId}_${sanitizedUsername}`;
                const baseDir = path.join(__dirname, '../storage', userFolder);
                const originalDir = path.join(baseDir, 'original');
                const convertedDir = path.join(baseDir, 'converted');

                // Ensure directories exist
                if (!fs.existsSync(originalDir)) fs.mkdirSync(originalDir, { recursive: true });
                if (!fs.existsSync(convertedDir)) fs.mkdirSync(convertedDir, { recursive: true });

                const timestamp = Date.now();
                const originalFilename = `original_${timestamp}.png`;
                const processedFilename = `converted_${timestamp}.png`;

                // Save Processed Image
                const processedBuffer = Buffer.from(req.body.imageData.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                fs.writeFileSync(path.join(convertedDir, processedFilename), processedBuffer);

                let originalRelPath = 'N/A';

                // Save Original Image if provided
                if (req.body.originalImage) {
                    const originalBuffer = Buffer.from(req.body.originalImage.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                    fs.writeFileSync(path.join(originalDir, originalFilename), originalBuffer);
                    originalRelPath = path.join(userFolder, 'original', originalFilename);
                }

                const processedRelPath = path.join(userFolder, 'converted', processedFilename);

                await ConversionImage.create({
                    logId: log.id,
                    processedPath: processedRelPath,
                    originalPath: originalRelPath
                });

                console.log(`[TrackUsage] Logged to ${userFolder}`);

                console.log(`[TrackUsage] Logged conversion metadata (ID: ${log.id}) and image blob for user ${req.userId}`);
            } catch (logError) {
                console.error("[TrackUsage] Failed to log conversion:", logError);
                // Don't fail the request if logging fails, just log the error
            }
        }

        res.status(200).send({
            message: 'Usage tracked.',
            usage: user.monthlyUsage,
            limit: user.monthlyLimit
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
