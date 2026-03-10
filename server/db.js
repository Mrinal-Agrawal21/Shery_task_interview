const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb+srv://agrawalmrinal21_db_user:pQBbcFde7TTsAUxL@shery.ou3v77p.mongodb.net/';
        await mongoose.connect(uri);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
