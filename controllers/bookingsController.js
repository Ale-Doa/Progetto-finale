const Booking = require('../models/Bookings');
const { DateTime } = require('luxon');

const getBookings = async (req, res) => {
    try {
        const dateParam = req.query.date;
        let selectedDate = '';
        let slotsData = null;
        let userBooking = null;
        let allFull = false;
        let isWeekend = false;

        if (dateParam && DateTime.fromISO(dateParam).isValid) {
            const dt = DateTime.fromISO(dateParam);
            selectedDate = dt.toISODate();

            if (dt.weekday === 6 || dt.weekday === 7) {
                isWeekend = true;
            } else {
                const slots = [
                    '9:00-10:30', '10:30-12:00',
                    '14:00-15:30', '15:30-17:00',
                    '17:00-18:30', '18:30-20:00',
                    '20:00-21:30'
                ];
                slotsData = await Promise.all(slots.map(async slot => {
                    const count = await Booking.countDocuments({ bookingDate: dt.toJSDate(), slot });
                    return {
                        name: slot,
                        available: 15 - count,
                        isFull: (15 - count) <= 0
                    };
                }));
                userBooking = await Booking.findOne({
                    user: req.session.user.id,
                    bookingDate: dt.toJSDate()
                });
                allFull = slotsData.every(slot => slot.isFull);
            }
        }

        res.render('bookings/calendar', {
            error: req.query.error || null,
            success: req.query.success || null,
            selectedDate: selectedDate,
            slots: slotsData,
            userBooking: userBooking,
            allFull: allFull,
            isWeekend: isWeekend
        });
    } catch (error) {
        res.render('bookings/calendar', {
            error: 'Errore nel caricamento delle prenotazioni',
            success: null,
            selectedDate: '',
            slots: null,
            userBooking: null,
            allFull: false,
            isWeekend: false
        });
    }
};

const createBooking = async (req, res) => {
    try {
        const { date, slot } = req.body;
        if (!DateTime.fromISO(date).isValid) {
            return res.redirect('/bookings?error=Data non valida');
        }
        const dt = DateTime.fromISO(date);
        if (dt.weekday === 6 || dt.weekday === 7) {
            return res.redirect(`/bookings?date=${date}&error=La palestra è chiusa nei weekend`);
        }
        const bookingDate = dt.toJSDate();
        const bookingsCount = await Booking.countDocuments({ bookingDate, slot });
        if (bookingsCount >= 15) {
            return res.redirect(`/bookings?date=${date}&error=Slot completo`);
        }
        const existingBooking = await Booking.findOne({
            user: req.session.user.id,
            bookingDate
        });
        if (existingBooking) {
            return res.redirect(`/bookings?date=${date}&error=Hai già una prenotazione per questa data`);
        }
        await Booking.create({
            user: req.session.user.id,
            bookingDate,
            slot
        });
        res.redirect(`/bookings?date=${date}&success=Prenotazione effettuata con successo`);
    } catch (error) {
        res.redirect('/bookings?error=Errore nella prenotazione');
    }
};

module.exports = { getBookings, createBooking };