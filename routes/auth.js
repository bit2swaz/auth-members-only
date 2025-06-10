const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const { body, validationResult } = require('express-validator');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Please log in to view this resource');
  res.redirect('/auth/login');
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.is_admin) {
    return next();
  }
  req.flash('error_msg', 'Access denied. Admin privileges required');
  res.redirect('/');
};

// Login page - GET
router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('auth/login', { title: 'Login' });
});

// Login - POST
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: true
}));

// Register page - GET
router.get('/register', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('auth/register', { title: 'Register' });
});

// Register - POST
router.post('/register', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/register', { title: 'Register', errors: errors.array() });
  }

  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      req.flash('error_msg', 'Email is already registered');
      return res.redirect('/auth/register');
    }

    // Create user
    const newUser = await User.create(firstName, lastName, email, password);

    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Registration error:', error);
    req.flash('error_msg', 'An error occurred during registration');
    res.redirect('/auth/register');
  }
});

// Join Club page - GET
router.get('/join-club', isAuthenticated, (req, res) => {
  res.render('auth/join-club', { title: 'Join Club' });
});

// Join Club - POST
router.post('/join-club', isAuthenticated, [
  body('passcode').equals(process.env.SECRET_PASSCODE).withMessage('Invalid passcode')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/join-club', { title: 'Join Club', errors: errors.array() });
  }

  try {
    await User.update(req.user.id, { isMember: true });
    req.flash('success_msg', 'You are now a member!');
    res.redirect('/');
  } catch (error) {
    console.error('Join club error:', error);
    req.flash('error_msg', 'An error occurred while joining the club');
    res.redirect('/auth/join-club');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/');
    }
    res.redirect('/auth/login');
  });
});

module.exports = {
  router,
  isAuthenticated,
  isAdmin
}; 