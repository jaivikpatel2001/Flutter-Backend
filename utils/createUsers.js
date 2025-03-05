const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createUsers = async () => {
    try {
        // Create superadmin if not exists
        const existingSuperadmin = await User.findOne({ role: 'superadmin' });
        if (!existingSuperadmin) {
            const superadmin = await User.create({
                firstName: 'Super',
                lastName: 'Admin',
                email: 'superadmin@example.com',
                password: await bcrypt.hash('password', 10),
                role: 'superadmin',
                isVerified: true,
                address: 'Superadmin Address',
                pinCode: '00001',
                permissions: [], // Add permissions if needed
                createdBy: null // No creator for superadmin
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
                firstName: 'Sports',
                lastName: 'Club',
                email: 'club@example.com',
                password: await bcrypt.hash('password', 10),
                role: 'club',
                isVerified: true,
                createdBy: superadmin._id,
                address: '123 Club St',
                pinCode: '12345',
                permissions: [], // Add permissions if needed
            });
            console.log('Club user created successfully');
        } else {
            console.log('Club user already exists');
        }

        // Create doctor by club
        const club = await User.findOne({ role: 'club' });
        const existingDoctor = await User.findOne({ role: 'doctor' });
        if (!existingDoctor) {
            await User.create({
                firstName: 'Dr.',
                lastName: 'Smith',
                email: 'doctor@example.com',
                password: await bcrypt.hash('password', 10),
                role: 'doctor',
                isVerified: true,
                createdBy: club._id,
                address: '456 Doctor St',
                pinCode: '54321',
                permissions: [], // Add permissions if needed
                doctorDetails: {
                    Type: 'Physician',
                    WorkExp: 5
                }
            });
            console.log('Doctor user created successfully');
        } else {
            console.log('Doctor user already exists');
        }

        // Create sportsperson by club
        const existingSportsperson = await User.findOne({ role: 'sportsperson' });
        if (!existingSportsperson) {
            await User.create({
                firstName: 'John',
                lastName: 'Doe',
                email: 'sportsperson@example.com',
                password: await bcrypt.hash('password', 10),
                role: 'sportsperson',
                isVerified: true,
                createdBy: club._id,
                address: '789 Sportsperson St',
                pinCode: '67890',
                permissions: [], // Add permissions if needed
                sportspersonDetails: {
                    birthDate: new Date('1990-01-01'),
                    allergic: false,
                    allergies: []
                }
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