const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const User = require('./models/User');
const ConversionLog = require('./models/ConversionLog');
const ConversionImage = require('./models/ConversionImage');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
app.use('/api/dashboard', require('./routes/dashboardRoutes'));


// Simple route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Backend Application.' });
});

// Sync Database and Start Server
const PORT = process.env.PORT || 3000;

const connectWithRetry = (retries = 5, delay = 5000) => {
    sequelize.sync({ alter: true })
        .then(() => {
            console.log('Database synced successfully.');
            const server = app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}.`);
            });

            server.on('error', (error) => {
                console.error('Server Error:', error);
            });
        })
        .catch((err) => {
            console.error('Failed to sync database:', err.message);
            if (retries > 0) {
                console.log(`Retrying database connection in ${delay / 1000} seconds... (${retries} attempts left)`);
                setTimeout(() => connectWithRetry(retries - 1, delay), delay);
            } else {
                console.error('Max retries reached. Exiting...');
                process.exit(1);
            }
        });
};

connectWithRetry();
