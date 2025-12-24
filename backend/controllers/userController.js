const User = require('../models/User');

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

        res.status(200).send({
            message: 'Usage tracked.',
            usage: user.monthlyUsage,
            limit: user.monthlyLimit
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
