const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zodbp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
        await mongoose.connect(connectionString);
        console.log('MongoDB Connected...');
    } catch (error) {
        console.error('MongoDB Connection Failed:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
