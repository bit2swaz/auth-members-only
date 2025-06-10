require('dotenv').config();
const User = require('../models/user');

async function createAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file');
      process.exit(1);
    }

    // Check if admin user already exists
    const existingAdmin = await User.findByEmail(adminEmail);
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create(
      'Admin',
      'User',
      adminEmail,
      adminPassword,
      true // isAdmin
    );

    console.log('Admin user created successfully:', admin);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser(); 