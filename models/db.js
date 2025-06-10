const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Parse the DATABASE_URL if it exists
let config = {};
if (process.env.DATABASE_URL) {
  try {
    // Parse the DATABASE_URL
    const url = new URL(process.env.DATABASE_URL);
    console.log('Database URL parsed successfully:', {
      host: url.hostname,
      port: url.port,
      database: url.pathname.slice(1),
      user: url.username
    });

    config = {
      host: url.hostname,
      port: url.port,
      database: url.pathname.slice(1),
      user: url.username,
      password: url.password,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      max: 20,
    };
  } catch (error) {
    console.error('Error parsing DATABASE_URL:', error);
    throw error;
  }
} else {
  // Fallback to individual parameters
  config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    max: 20,
  };
}

console.log('Database configuration:', {
  host: config.host,
  port: config.port,
  database: config.database,
  user: config.user,
  ssl: config.ssl ? 'enabled' : 'disabled'
});

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
      console.log(`Attempting database connection (attempt ${i + 1}/${retries})...`);
      const res = await pool.query('SELECT NOW()');
      console.log('Database connected successfully at:', res.rows[0].now);
      return true;
    } catch (err) {
      console.error(`Database connection attempt ${i + 1} failed:`, {
        message: err.message,
        code: err.code,
        errno: err.errno,
        syscall: err.syscall,
        hostname: err.hostname
      });
      
      if (i === retries - 1) {
        console.error('All database connection attempts failed');
        return false;
      }
      
      console.log(`Retrying in ${delay}ms...`);
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