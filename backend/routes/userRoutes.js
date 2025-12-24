const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/dashboard', [verifyToken], userController.getDashboard);
router.post('/track', [verifyToken], userController.trackUsage);

module.exports = router;
