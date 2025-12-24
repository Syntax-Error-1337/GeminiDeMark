const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ConversionLog = require('./ConversionLog');

const ConversionImage = sequelize.define('ConversionImage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    logId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ConversionLog,
            key: 'id'
        }
    },
    processedPath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    originalPath: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'conversion_images',
    timestamps: false
});

module.exports = ConversionImage;
