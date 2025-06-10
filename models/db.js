const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Parse the DATABASE_URL if it exists
let config = {};
if (process.env.DATABASE_URL) {
  // Parse the DATABASE_URL
  const url = new URL(process.env.DATABASE_URL);
  config = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    // Add connection timeout and retry settings
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    max: 20, // Maximum number of clients in the pool
  };
} else {
  // Fallback to individual parameters
  config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    // Add connection timeout and retry settings
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    max: 20,
  };
}

// Create the pool with the configuration
const pool = new Pool(config);

// Add error handler for the pool
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test the connection with retry logic
const testConnection = async (retries = 5, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await pool.query('SELECT NOW()');
      console.log('Database connected successfully at:', res.rows[0].now);
      return true;
    } catch (err) {
      console.error(`Database connection attempt ${i + 1} failed:`, err.message);
      if (i === retries - 1) {
        console.error('All database connection attempts failed');
        return false;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return false;
};

// Test the connection
testConnection();

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  testConnection
}; 