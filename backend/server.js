const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// Routes
const userRoutes = require('./routes/userRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Simple route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Backend Application.' });
});

// Sync Database and Start Server
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced successfully.');
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });

        server.on('error', (error) => {
            console.error('Server Error:', error);
        });

        // Keep-alive to prevent process exit if something closes the server
        setInterval(() => {
            // Heartbeat
        }, 100000);
    })
    .catch((err) => {
        console.error('Failed to sync database: ' + err.message);
    });
