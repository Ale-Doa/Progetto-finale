const User = require('../models/User');
const { DateTime } = require('luxon');

const getAdminDashboard = async (req, res) => {
    try {
        if (!req.session.user || req.session.user.membershipType !== 'admin') {
            return res.redirect('/auth/login?error=Accesso non autorizzato');
        }

        // Ottieni tutti gli utenti dal database, escludendo gli admin
        const users = await User.find({ membershipType: { $ne: 'admin' } }).lean();

        // Calcola la data di scadenza per gli utenti premium
        const usersWithExpiry = users.map(user => {
            let subscriptionEndDate = null;
            if (['premium1', 'premium3', 'premium6', 'premium12'].includes(user.membershipType)) {
                const months = parseInt(user.membershipType.replace('premium', ''), 10);
                const registrationDate = DateTime.fromJSDate(user.registrationDate);
                subscriptionEndDate = registrationDate.plus({ months }).toISODate();
            }
            return { ...user, subscriptionEndDate };
        });

        // Passa i parametri success/error dalla query string
        const successMessage = req.query.success ? decodeURIComponent(req.query.success) : null;
        const errorMessage = req.query.error ? decodeURIComponent(req.query.error) : null;

        res.render('admin/dashboard', {
            users: usersWithExpiry,
            currentUser: req.session.user,
            success: successMessage,
            error: errorMessage
        });
    } catch (error) {
        console.error('Errore nel caricamento della dashboard admin:', error);
        res.status(500).send('Qualcosa è andato storto!');
    }
};

const updateMembership = async (req, res) => {
    try {
        const { userId, membershipType } = req.body;

        // Verifica che il tipo di abbonamento sia valido
        if (!['basic', 'premium1', 'premium3', 'premium6', 'premium12', 'admin'].includes(membershipType)) {
            return res.redirect('/admin/dashboard?error=Tipo di abbonamento non valido');
        }

        // Trova l'utente e aggiorna il tipo di abbonamento
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { membershipType },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.redirect('/admin/dashboard?error=Utente non trovato');
        }

        res.redirect('/admin/dashboard?success=Abbonamento aggiornato con successo');
    } catch (error) {
        console.error('Errore durante l\'aggiornamento del tipo di abbonamento:', error);
        res.redirect('/admin/dashboard?error=Errore durante l\'aggiornamento del tipo di abbonamento');
    }
};

module.exports = { getAdminDashboard, updateMembership };