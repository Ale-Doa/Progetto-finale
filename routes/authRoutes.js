const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');

router.get('/register', (req, res) => res.render('auth/register', { error: null, email: '', name: '' }));
router.post('/register', registerUser);

router.get('/login', (req, res) => res.render('auth/login', { error: null, email: '' }));
router.post('/login', loginUser);

router.get('/logout', logoutUser);

module.exports = router;