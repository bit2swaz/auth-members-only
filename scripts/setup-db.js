const fs = require('fs');
const path = require('path');
const db = require('../models/db');

async function setupDatabase() {
  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, '../models/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute the schema
    await db.query(schema);
    console.log('Database schema created successfully');

    // Check if admin user exists
    const adminResult = await db.query('SELECT * FROM users WHERE email = $1', ['admin@example.com']);
    
    if (adminResult.rows.length === 0) {
      // Create admin user if it doesn't exist
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await db.query(
        'INSERT INTO users (first_name, last_name, email, password, is_admin, is_member) VALUES ($1, $2, $3, $4, $5, $6)',
        ['Admin', 'User', 'admin@example.com', hashedPassword, true, true]
      );
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase(); 