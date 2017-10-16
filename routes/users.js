const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.get('/register', (req, res) => {
  res.render('users/register');
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
  }
});


module.exports = router;
