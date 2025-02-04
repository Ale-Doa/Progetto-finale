const express = require('express');
const router = express.Router();
const { getAdminDashboard, updateMembership } = require('../controllers/adminController');

// Middleware per verificare l'accesso admin
const requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.membershipType !== 'admin') {
    return res.redirect('/auth/login?error=Accesso non autorizzato');
  }
  next();
};

// Mostra la dashboard admin
router.get('/dashboard', requireAdmin, getAdminDashboard);

// Aggiorna il tipo di abbonamento di un utente
router.post('/update-membership', requireAdmin, updateMembership);

module.exports = router;