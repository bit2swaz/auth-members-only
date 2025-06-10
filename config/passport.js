const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        console.log('Attempting login for email:', email);
        
        // Find user
        const user = await User.findByEmail(email);
        if (!user) {
          console.log('User not found');
          return done(null, false, { message: 'Invalid email or password' });
        }
        console.log('User found:', { id: user.id, email: user.email, is_admin: user.is_admin });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          console.log('Password mismatch');
          return done(null, false, { message: 'Invalid email or password' });
        }
        console.log('Password matched, login successful');

        return done(null, user);
      } catch (error) {
        console.error('Passport authentication error:', error);
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    console.log('Serializing user:', user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      console.log('Deserializing user:', id);
      const user = await User.findById(id);
      console.log('Deserialized user:', user);
      done(null, user);
    } catch (error) {
      console.error('Deserialization error:', error);
      done(error);
    }
  });
}; 