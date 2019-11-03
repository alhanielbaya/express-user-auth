const express = require('express');
const router = express.Router();
const passport = require('passport');
const {checkIfLoggedIn} =require('../../config/auth')

const path = require('path');


router.get('/login', checkIfLoggedIn, (req, res) => {
  res.render('login');
});

router.get('/register', checkIfLoggedIn, (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  // Check passwords match
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  // Check passwords length
  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // User Model
    const userModel = require(path.resolve('./server/Models/User'));
    userModel.checkIfEmailExists(email).then(emailExists => {
      if (emailExists) {
        errors.push({ msg: 'Email is already taken', type: 'EMAIL_TAKEN' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        userModel.registerUser(name, email, password);
        req.flash('success_msg', 'You have succesfully registered and can login.')
        res.redirect('/users/login')
      }
    });
  }
});


// Handle Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
})

// Handle Loguot
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are now logged out');
  res.redirect('/users/login');
})

module.exports = router;
