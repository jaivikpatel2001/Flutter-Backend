const bcrypt = require('bcryptjs');
const User = require('../models/User');

let superadminCreated = false;

const createSuperadmin = async () => {
    if (superadminCreated) return;
    
    try {
        const existingSuperadmin = await User.findOne({ role: 'superadmin' });
        if (existingSuperadmin) {
            superadminCreated = true;
            return console.log('Superadmin already exists');
        }

        const superadmin = await User.create({
            name: 'superadmin',
            email: 'superadmin@example.com',
            password: await bcrypt.hash('superadmin123', 10),
            role: 'superadmin',
            isVerified: true
        });

        superadminCreated = true;
        console.log('Superadmin created successfully');
    } catch (error) {
        console.error('Error creating superadmin user:', error);
    }
};

module.exports = createSuperadmin;