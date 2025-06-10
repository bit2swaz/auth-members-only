const express = require('express');
const router = express.Router();
const Message = require('../models/message');

// Home page route
router.get('/', async (req, res) => {
  try {
    // Get all messages if user is a member, otherwise just show a welcome page
    let messages = [];
    if (req.isAuthenticated() && req.user.is_member) {
      messages = await Message.getAll();
    }
    
    res.render('index', { 
      title: 'Members Only',
      messages,
      user: req.user
    });
  } catch (error) {
    console.error('Error loading homepage:', error);
    req.flash('error_msg', 'An error occurred while loading the homepage');
    res.render('index', { 
      title: 'Members Only',
      messages: [],
      user: req.user
    });
  }
});

module.exports = router; 