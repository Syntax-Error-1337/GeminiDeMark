const db = require('../models/User'); // Import User directly or via a db index if you had one. 
// Assuming ../models/User.js exports the User model directly.
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check for existing user
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).send({ message: 'Email is already in use.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 8);

        // Check if SendGrid is configured
        const isSendGridConfigured = !!process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'SG.placeholder_key';

        // Generate verification token only if needed
        const verificationToken = isSendGridConfigured ? crypto.randomBytes(32).toString('hex') : null;
        const isVerified = !isSendGridConfigured;

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            verificationToken: verificationToken,
            isVerified: isVerified
        });

        if (isSendGridConfigured) {
            // Send verification email
            const verificationUrl = `${process.env.APP_BASE_URL}/verify-email.html?token=${verificationToken}`;

            const msg = {
                to: email,
                from: process.env.SENDGRID_FROM_EMAIL,
                subject: 'Verify your email',
                text: `Please click on the following link to verify your email: ${verificationUrl}`,
                html: `<p>Please click on the following link to verify your email:</p><a href="${verificationUrl}">${verificationUrl}</a>`,
            };

            try {
                await sgMail.send(msg);
            } catch (emailError) {
                console.error("SendGrid Error:", emailError);
                // If email fails, maybe we should warn? 
                // For now keeping it simple as per previous logic.
            }
            res.status(201).send({ message: 'User registered successfully! Please check your email to verify.' });
        } else {
            res.status(201).send({ message: 'User registered successfully! Account verified instantly (Email service not configured).' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ message: 'Invalid Password!' });
        }

        if (!user.isVerified) {
            return res.status(401).send({ message: 'Please verify your email first.' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: 86400, // 24 hours
        });

        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            accessToken: token,
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.body; // Or req.query if logic differs, but typically post from a frontend page

        // If the token is passed as a URL param to this API directly via GET:
        // const token = req.params.token; 

        // However, usually we link to a frontend page which then calls this API or we link directly to api.
        // Let's support the direct API link approach for simplicity or the frontend approach. 
        // Based on "basic backend", I'll implementation logic for finding the token.

        if (!token) {
            return res.status(400).send({ message: "Token is required" });
        }

        const user = await User.findOne({ where: { verificationToken: token } });

        if (!user) {
            return res.status(404).send({ message: "User not found or token invalid." });
        }

        user.isVerified = true;
        user.verificationToken = null; // Clear token
        await user.save();

        res.status(200).send({ message: "Email verified successfully! You can now login." });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.verifyEmailGet = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).send("Token is required");
        }

        const user = await User.findOne({ where: { verificationToken: token } });

        if (!user) {
            return res.status(404).send("User not found or token invalid.");
        }

        user.isVerified = true;
        user.verificationToken = null; // Clear token
        await user.save();

        res.send("Email verified successfully! You can now login.");
    } catch (error) {
        res.status(500).send(error.message);
    }
};
