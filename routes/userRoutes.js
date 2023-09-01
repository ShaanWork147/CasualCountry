const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const wrapAsync = require('../utils/Wrapasync');


// user Signup
router.get('/user/signup', wrapAsync(async (req, res) => {
  res.render('./admin/usersignup');
}));

// user Login
router.get('/user/login', wrapAsync(async(req, res) => {
  res.render('./admin/userlogin');
}));

router.post('/user/login', passport.authenticate('user', {
  failureRedirect: '/user/login',
  failureFlash: true
}), (req, res) => {
  req.flash('success', 'Welcome back, user!');
  res.redirect('/');
});

// Handling the new user request
router.post('/user/signup', wrapAsync( async (req, res, next) => {
  const { email, password } = req.body;
  
  const foundUser = await User.find({ email });
  if (foundUser.length) {
      // Setup flash and call it here
      req.flash('error', 'Email already in use. Try different Email or Login instead.')
      return res.redirect('/user/signup')
  }
  const user = new User({ ...req.body });
  const registeredUser = await User.register(user, password, function (err, newUser) {
      if (err) {
          next(err);
      }
      req.logIn(newUser, () => {
          res.redirect('/');
      })
  });
}));
router.get('/user/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
module.exports = router;




