require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

async function resetAdmin() {
  try {
    console.log('Starting admin reset...');
    
    // Delete existing admin user
    await pool.query('DELETE FROM users WHERE email = $1', ['admin@example.com']);
    console.log('Deleted existing admin user');
    
    // Create new admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await pool.query(
      'INSERT INTO users (first_name, last_name, email, password, is_admin, is_member) VALUES ($1, $2, $3, $4, $5, $6)',
      ['Admin', 'User', 'admin@example.com', hashedPassword, true, true]
    );
    console.log('Admin user created successfully with password: admin123');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error resetting admin:', error);
    await pool.end();
    process.exit(1);
  }
}

resetAdmin(); 