const db = require('./db');
const bcrypt = require('bcrypt');

const User = {
  // Create a new user
  async create(firstName, lastName, email, password, isMember = false, isAdmin = false) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await db.query(
        'INSERT INTO users (first_name, last_name, email, password, is_member, is_admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [firstName, lastName, email, hashedPassword, isMember, isAdmin]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Find a user by email
  async findByEmail(email) {
    try {
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  },

  // Find a user by ID
  async findById(id) {
    try {
      const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  },

  // Update user details
  async update(id, updates) {
    try {
      const { firstName, lastName, email, isMember, isAdmin } = updates;
      const result = await db.query(
        'UPDATE users SET first_name = $1, last_name = $2, email = $3, is_member = $4, is_admin = $5 WHERE id = $6 RETURNING *',
        [firstName, lastName, email, isMember, isAdmin, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Update user password
  async updatePassword(id, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await db.query(
        'UPDATE users SET password = $1 WHERE id = $2 RETURNING *',
        [hashedPassword, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  },

  // Authenticate a user
  async authenticate(email, password) {
    try {
      const user = await this.findByEmail(email);
      if (!user) return null;
      
      const isMatch = await bcrypt.compare(password, user.password);
      return isMatch ? user : null;
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    }
  },

  // Get all users
  async getAll() {
    try {
      const result = await db.query('SELECT id, first_name, last_name, email, is_member, is_admin FROM users');
      return result.rows;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }
};

module.exports = User; 