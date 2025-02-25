const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createSuperadmin = async () => {
    try {
        // Check if superadmin already exists
        const existingSuperadmin = await User.findOne({ role: 'superadmin' });
        if (existingSuperadmin) {
            console.log('Superadmin already exists');
            return;
        }

        // Create superadmin credentials
        const superadminData = {
            name: 'superadmin',
            email: 'superadmin@example.com',
            password: await bcrypt.hash('superadmin123', 10), // Encrypt password
            role: 'superadmin',
            isVerified: true
        };

        // Create new superadmin
        const superadmin = new User(superadminData);
        await superadmin.save();

        console.log('Superadmin created successfully');
    } catch (error) {
        console.error('Error creating superadmin:', error);
    }
};

module.exports = createSuperadmin;
