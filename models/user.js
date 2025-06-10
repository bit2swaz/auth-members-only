const db = require('./db');
const bcrypt = require('bcrypt');

class User {
  static async create(firstName, lastName, email, password) {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const query = `
        INSERT INTO users (first_name, last_name, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id, first_name, last_name, email, is_member, is_admin
      `;
      const values = [firstName, lastName, email, hashedPassword];
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const query = `
        SELECT id, first_name, last_name, email, password, is_member, is_admin
        FROM users
        WHERE email = $1
      `;
      const result = await db.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = `
        SELECT id, first_name, last_name, email, is_member, is_admin
        FROM users
        WHERE id = $1
      `;
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  }

  static async update(id, updates) {
    try {
      const allowedUpdates = ['first_name', 'last_name', 'email', 'is_member', 'is_admin'];
      const updateFields = [];
      const values = [id];
      let valueIndex = 2;

      for (const [key, value] of Object.entries(updates)) {
        if (allowedUpdates.includes(key)) {
          updateFields.push(`${key} = $${valueIndex}`);
          values.push(value);
          valueIndex++;
        }
      }

      if (updateFields.length === 0) {
        throw new Error('No valid fields to update');
      }

      const query = `
        UPDATE users
        SET ${updateFields.join(', ')}
        WHERE id = $1
        RETURNING id, first_name, last_name, email, is_member, is_admin
      `;
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

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
  }

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
  }

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
}

module.exports = User; 