const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mysql = require('mysql2/promise');

async function initializeDatabase() {
    const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

    try {
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASS,
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        console.log(`Database '${DB_NAME}' created or successfully checked.`);

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error creating database:', error.message);
        process.exit(1);
    }
}

initializeDatabase();
