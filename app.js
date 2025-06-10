const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const pgSession = require('connect-pg-simple')(session);
const { pool } = require('./models/db');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files with proper caching
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  etag: true
}));

// Session setup with PostgreSQL store
app.use(session({
  store: new pgSession({
    pool,
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 60 * 60 * 1000, // 1 hour
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
require('./config/passport')(passport);

// Flash messages
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Routes
const indexRouter = require('./routes/index');
const { router: authRouter } = require('./routes/auth');
const messagesRouter = require('./routes/messages');

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/messages', messagesRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 