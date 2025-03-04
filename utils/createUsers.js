const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createUsers = async () => {
    try {
        // Create superadmin if not exists
        const existingSuperadmin = await User.findOne({ role: 'superadmin' });
        if (!existingSuperadmin) {
            const superadmin = await User.create({
                name: 'Super Admin',
                email: 'superadmin@example.com',
                password: await bcrypt.hash('password', 10),
                role: 'superadmin',
                isVerified: true
            });
            console.log('Superadmin created successfully');
        } else {
            console.log('Superadmin already exists');
        }

        // Create club user by superadmin
        const superadmin = await User.findOne({ role: 'superadmin' });
        const existingClub = await User.findOne({ role: 'club' });
        if (!existingClub) {
            await User.create({
                name: 'Sports Club',
                email: 'club@example.com',
                password: await bcrypt.hash('password', 10),
                role: 'club',
                isVerified: true,
                createdBy: superadmin._id
            });
            console.log('Club user created successfully');
        } else {
            console.log('Club user already exists');
        }

        // Create doctor and sportsperson by club
        const club = await User.findOne({ role: 'club' });
        const existingDoctor = await User.findOne({ role: 'doctor' });
        if (!existingDoctor) {
            await User.create({
                name: 'Dr. Smith',
                email: 'doctor@example.com',
                password: await bcrypt.hash('password', 10),
                role: 'doctor',
                isVerified: true,
                createdBy: club._id
            });
            console.log('Doctor user created successfully');
        } else {
            console.log('Doctor user already exists');
        }

        const existingSportsperson = await User.findOne({ role: 'sportsperson' });
        if (!existingSportsperson) {
            await User.create({
                name: 'John Doe',
                email: 'sportsperson@example.com',
                password: await bcrypt.hash('password', 10),
                role: 'sportsperson',
                isVerified: true,
                createdBy: club._id
            });
            console.log('Sportsperson user created successfully');
        } else {
            console.log('Sportsperson user already exists');
        }

    } catch (error) {
        console.error('Error creating users:', error);
    }
};

module.exports = createUsers;