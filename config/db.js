const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const connectionString = process.env.MongoDB_USER; // Corrected the connection string
        await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }); // Added options for connection
        console.log('MongoDB Connected...');
    } catch (error) {
        console.error('MongoDB Connection Failed:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
