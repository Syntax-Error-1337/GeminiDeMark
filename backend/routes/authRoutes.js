const express = require('express');
const router = express.router ? express.Router() : express.Router; // Fixed: express.Router() is a function
// actually express.Router is the constructor. Correct usage: const router = express.Router();
const authController = require('../controllers/authController');

const r = express.Router();

r.post('/register', authController.register);
r.post('/login', authController.login);
r.post('/verify-email', authController.verifyEmail);
r.post('/resend-verification', authController.resendVerification);
r.get('/verify-email', authController.verifyEmailGet); // For email links: /api/auth/verify-email?token=...
// Note: If using GET for direct link verification from email:
// r.get('/verify-email/:token', ...);
// But the controller expects body currently. I'll stick to POST from a frontend or update controller to handle params.
// Let's add the GET variant for convenience if the user just clicks the link and we want to return JSON.
// Ideally, the link goes to a frontend page.
// I will keep POST for API consistency and assume a frontend handles the token extraction from URL.

module.exports = r;
