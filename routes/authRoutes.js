const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/register', (req, res) => res.render('auth/register', { 
  error: null,
  email: '',
  name: ''
}));
router.get('/login', (req, res) => res.render('auth/login', { 
  error: null,
  email: '' 
}));

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('auth/register', { 
        error: 'Email già registrata',
        name,
        email
      });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.redirect('/auth/login');
  } catch (error) {
    res.render('auth/register', { 
      error: 'Errore durante la registrazione',
      name: req.body.name,
      email: req.body.email
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render('auth/login', { 
        error: 'Credenziali non valide',
        email
      });
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      membershipType: user.membershipType
    };

    res.redirect('/dashboard');
  } catch (error) {
    res.render('auth/login', { 
      error: 'Errore durante il login',
      email: req.body.email
    });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
});

module.exports = router;