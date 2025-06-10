const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const { isAuthenticated, isAdmin } = require('./auth');

// Get all messages - only for members
router.get('/', isAuthenticated, async (req, res) => {
  try {
    if (!req.user.is_member) {
      req.flash('error_msg', 'You must be a member to view messages');
      return res.redirect('/');
    }
    
    const messages = await Message.getAll();
    res.render('messages/index', { 
      title: 'All Messages',
      messages
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    req.flash('error_msg', 'An error occurred while retrieving messages');
    res.redirect('/');
  }
});

// Get message creation form
router.get('/new', isAuthenticated, (req, res) => {
  res.render('messages/new', { title: 'Create Message' });
});

// Create a new message
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title, text } = req.body;
    
    // Validate input
    if (!title || !text) {
      req.flash('error_msg', 'Please enter all fields');
      return res.redirect('/messages/new');
    }
    
    // Create message
    await Message.create(title, text, req.user.id);
    
    req.flash('success_msg', 'Message created successfully');
    res.redirect('/messages');
  } catch (error) {
    console.error('Error creating message:', error);
    req.flash('error_msg', 'An error occurred while creating the message');
    res.redirect('/messages/new');
  }
});

// Get a single message
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    if (!req.user.is_member) {
      req.flash('error_msg', 'You must be a member to view messages');
      return res.redirect('/');
    }
    
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      req.flash('error_msg', 'Message not found');
      return res.redirect('/messages');
    }
    
    res.render('messages/show', { 
      title: message.title,
      message
    });
  } catch (error) {
    console.error('Error getting message:', error);
    req.flash('error_msg', 'An error occurred while retrieving the message');
    res.redirect('/messages');
  }
});

// Get message edit form
router.get('/:id/edit', isAuthenticated, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      req.flash('error_msg', 'Message not found');
      return res.redirect('/messages');
    }
    
    // Check if user is the author or an admin
    if (message.user_id !== req.user.id && !req.user.is_admin) {
      req.flash('error_msg', 'You are not authorized to edit this message');
      return res.redirect('/messages');
    }
    
    res.render('messages/edit', { 
      title: 'Edit Message',
      message
    });
  } catch (error) {
    console.error('Error getting message for edit:', error);
    req.flash('error_msg', 'An error occurred while retrieving the message');
    res.redirect('/messages');
  }
});

// Update a message
router.post('/:id', isAuthenticated, async (req, res) => {
  try {
    const { title, text } = req.body;
    
    // Validate input
    if (!title || !text) {
      req.flash('error_msg', 'Please enter all fields');
      return res.redirect(`/messages/${req.params.id}/edit`);
    }
    
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      req.flash('error_msg', 'Message not found');
      return res.redirect('/messages');
    }
    
    // Check if user is the author or an admin
    if (message.user_id !== req.user.id && !req.user.is_admin) {
      req.flash('error_msg', 'You are not authorized to edit this message');
      return res.redirect('/messages');
    }
    
    // Update message
    await Message.update(req.params.id, title, text);
    
    req.flash('success_msg', 'Message updated successfully');
    res.redirect('/messages');
  } catch (error) {
    console.error('Error updating message:', error);
    req.flash('error_msg', 'An error occurred while updating the message');
    res.redirect(`/messages/${req.params.id}/edit`);
  }
});

// Delete a message
router.post('/:id/delete', isAuthenticated, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      req.flash('error_msg', 'Message not found');
      return res.redirect('/messages');
    }
    
    // Check if user is the author or an admin
    if (message.user_id !== req.user.id && !req.user.is_admin) {
      req.flash('error_msg', 'You are not authorized to delete this message');
      return res.redirect('/messages');
    }
    
    // Delete message
    await Message.delete(req.params.id);
    
    req.flash('success_msg', 'Message deleted successfully');
    res.redirect('/messages');
  } catch (error) {
    console.error('Error deleting message:', error);
    req.flash('error_msg', 'An error occurred while deleting the message');
    res.redirect('/messages');
  }
});

module.exports = router; 