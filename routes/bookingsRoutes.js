const express = require('express');
const router = express.Router();
const { getBookings, createBooking } = require('../controllers/bookingsController');
const { isPremium } = require('../utils');

const requirePremiumMembership = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login?error=Devi accedere per visualizzare questa pagina');
    }
    if (!isPremium(req.session.user.membershipType)) {
        return res.redirect('/dashboard?error=Solo utenti premium possono accedere a questa funzionalità');
    }
    next();
};

router.get('/', requirePremiumMembership, getBookings);
router.post('/prenota', requirePremiumMembership, createBooking);

module.exports = router;