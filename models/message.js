const db = require('./db');

const Message = {
  // Create a new message
  async create(title, text, userId) {
    try {
      const result = await db.query(
        'INSERT INTO messages (title, text, user_id, timestamp) VALUES ($1, $2, $3, NOW()) RETURNING *',
        [title, text, userId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  },

  // Find a message by ID
  async findById(id) {
    try {
      const result = await db.query(`
        SELECT m.*, u.first_name, u.last_name 
        FROM messages m
        JOIN users u ON m.user_id = u.id
        WHERE m.id = $1
      `, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error finding message by ID:', error);
      throw error;
    }
  },

  // Get all messages
  async getAll() {
    try {
      const result = await db.query(`
        SELECT m.*, u.first_name, u.last_name 
        FROM messages m
        JOIN users u ON m.user_id = u.id
        ORDER BY m.timestamp DESC
      `);
      return result.rows;
    } catch (error) {
      console.error('Error getting all messages:', error);
      throw error;
    }
  },

  // Get messages by user ID
  async getByUserId(userId) {
    try {
      const result = await db.query(`
        SELECT m.*, u.first_name, u.last_name 
        FROM messages m
        JOIN users u ON m.user_id = u.id
        WHERE m.user_id = $1
        ORDER BY m.timestamp DESC
      `, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error getting messages by user ID:', error);
      throw error;
    }
  },

  // Update a message
  async update(id, title, text) {
    try {
      const result = await db.query(
        'UPDATE messages SET title = $1, text = $2 WHERE id = $3 RETURNING *',
        [title, text, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  },

  // Delete a message
  async delete(id) {
    try {
      const result = await db.query('DELETE FROM messages WHERE id = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
};

module.exports = Message; 