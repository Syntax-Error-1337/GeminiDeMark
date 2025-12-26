const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const emailService = require('../services/emailService');

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

        // Verification Logic
        const requireVerification = process.env.REQUIRE_EMAIL_VERIFICATION === 'true';

        // If verification is required, we generate a token and set verified to false.
        // If not, we set verified to true immediately.
        const verificationToken = requireVerification ? crypto.randomBytes(32).toString('hex') : null;
        const isVerified = !requireVerification;

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            verificationToken: verificationToken,
            isVerified: isVerified
        });

        if (requireVerification) {
            // Send verification email
            try {
                await emailService.sendVerificationEmail(email, verificationToken);
                res.status(201).send({ message: 'User registered successfully! Please check your email to verify.' });
            } catch (emailError) {
                console.error("Email Service Error:", emailError);
                // In a real app, you might want to rollback the user creation or allow "resend verification"
                res.status(201).send({ message: 'User registered, but failed to send verification email. Please contact support or try logging in to resend.' });
            }
        } else {
            res.status(201).send({ message: 'User registered successfully! Account verified instantly.' });
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

        // Check verification status if required
        // Note: Even if REQUIRE_EMAIL_VERIFICATION is false NOW, we might want to respect the user's `isVerified` flag 
        // if they registered when it WAS true. 
        // So simple logic: if user.isVerified is false, deny access. 
        // The `register` function controls the initial state of `isVerified`.
        if (!user.isVerified) {
            // Optional: Allow login if verification is currently disabled globally?
            // Usually NO. If they have an unverified account, they should verify it.
            // But if the admin decides "turn off verification", maybe they want everyone to get in?
            // User's requirement: "if verificatin set to true all new registers usere need to verify theri email to lognin and access."
            // This implies if set to false, maybe we don't check? 
            // Logic: If verification is strict, check it.
            if (process.env.REQUIRE_EMAIL_VERIFICATION === 'true') {
                return res.status(401).send({ message: 'Please verify your email first.' });
            }
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
