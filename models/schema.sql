-- Drop tables if they exist
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_member BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_users_email ON users(email);

-- Insert admin user (password: admin123)
INSERT INTO users (first_name, last_name, email, password, is_member, is_admin)
VALUES ('Admin', 'User', 'admin@example.com', '$2b$10$rIC1lNBcRKOGLqXO0WmAReYz2LK.fAHJY5UxsvqcR3MwLvUw7JE2G', TRUE, TRUE); 