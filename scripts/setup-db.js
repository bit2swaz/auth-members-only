const fs = require('fs');
const path = require('path');
const db = require('../models/db');
const bcrypt = require('bcrypt');

async function setupDatabase() {
  try {
    console.log('Starting database setup...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, '../models/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute the schema
    await db.query(schema);
    console.log('Database schema created successfully');

    // Always recreate admin user
    console.log('Recreating admin user...');
    
    // Delete existing admin user if exists
    await db.query('DELETE FROM users WHERE email = $1', ['admin@example.com']);
    
    // Create new admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.query(
      'INSERT INTO users (first_name, last_name, email, password, is_admin, is_member) VALUES ($1, $2, $3, $4, $5, $6)',
      ['Admin', 'User', 'admin@example.com', hashedPassword, true, true]
    );
    console.log('Admin user created successfully with password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase(); 