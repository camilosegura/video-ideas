const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

require('../models/User');

const User = mongoose.model('users');


router.get('/login', (req, res) => {
  res.render('users/login');
});

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failuteRedirec: '/users/login',
    failureFlash: true
  })(req, res, next);
});

router.post('/register', (req, res) => {
  const errors = [];

  if (req.body.password !== req.body.password2) {
    errors.push({text: "Password don not match."})
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({email: req.body.email})
      .then(user => {
        if (user) {
          req.flash('error_msg', 'Email is already registered')
          res.redirect('/users/register');
        } else {
          const newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          }

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              newUser.password = hash;

              new User(newUser)
                .save()
                .then(() => {
                  req.flash('success_msg', 'You are registerd!');
                  res.redirect('/users/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                }) ;
            });
          });
        }
      });
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out.');
  req.redirect('/users/login');
})

module.exports = router;
