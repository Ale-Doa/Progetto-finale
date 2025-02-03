const User = require('../models/User');
const { DateTime } = require('luxon');
const { isPremium } = require('../utils');

const getDashboard = async (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');

    try {
        // Ottieni l'utente dal database
        const user = await User.findById(req.session.user.id).lean();

        let subscriptionEndDate = null;
        if (isPremium(user.membershipType)) {
            // Calcola la data di scadenza dell'abbonamento
            const months = parseInt(user.membershipType.replace('premium', ''), 10);
            const registrationDate = DateTime.fromJSDate(user.registrationDate);
            subscriptionEndDate = registrationDate.plus({ months }).toISODate();
        }

        res.render('dashboard', {
            user: req.session.user,
            isPremium: isPremium,
            subscriptionEndDate
        });
    } catch (error) {
        console.error('Errore nel caricamento della dashboard:', error);
        res.status(500).send('Qualcosa è andato storto!');
    }
};

module.exports = { getDashboard };