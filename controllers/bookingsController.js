const Booking = require('../models/Bookings');
const { DateTime } = require('luxon');
const { isHoliday } = require('../utils');

const getBookings = async (req, res) => {
    try {
      const dateParam = req.query.date;
      let selectedDate = '';
      let slotsData = null;
      let userBooking = null;
      let allFull = false;
      let isWeekend = false;
      let isHolidayFlag = false; // Nuovo flag per indicare se la data è festiva
  
      if (dateParam && DateTime.fromISO(dateParam).isValid) {
        const dt = DateTime.fromISO(dateParam);
        selectedDate = dt.toISODate();
  
        // Verifica se è weekend o festivo
        if (dt.weekday === 6 || dt.weekday === 7) {
          isWeekend = true;
        } else {
          isHolidayFlag = isHoliday(dt.toJSDate()); // Controlla se la data è festiva
  
          // Se non è weekend né festivo, carica i dati degli slot
          if (!isHolidayFlag) {
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
      }
  
      res.render('bookings/calendar', {
        error: req.query.error || null,
        success: req.query.success || null,
        selectedDate: selectedDate,
        slots: slotsData,
        userBooking: userBooking,
        allFull: allFull,
        isWeekend: isWeekend,
        isHoliday: isHolidayFlag // Passa il flag alla view
      });
    } catch (error) {
      res.render('bookings/calendar', {
        error: 'Errore nel caricamento delle prenotazioni',
        success: null,
        selectedDate: '',
        slots: null,
        userBooking: null,
        allFull: false,
        isWeekend: false,
        isHoliday: false
      });
    }
  };

const createBooking = async (req, res) => {
    try {
      const { date, slot } = req.body;
  
      // Verifica la validità della data
      if (!DateTime.fromISO(date).isValid) {
        return res.redirect('/bookings?error=Data non valida');
      }
  
      const dt = DateTime.fromISO(date);
  
      // Verifica se è weekend o giorno festivo
      if (dt.weekday === 6 || dt.weekday === 7 || isHoliday(dt.toJSDate())) {
        return res.redirect(`/bookings?date=${date}&error=La palestra è chiusa in questa data`);
      }
  
      const bookingDate = dt.toJSDate();
      const bookingsCount = await Booking.countDocuments({ bookingDate, slot });
  
      // Verifica se lo slot è completo
      if (bookingsCount >= 15) {
        return res.redirect(`/bookings?date=${date}&error=Slot completo`);
      }
  
      // Verifica se l'utente ha già una prenotazione per la stessa data
      const existingBooking = await Booking.findOne({
        user: req.session.user.id,
        bookingDate
      });
  
      if (existingBooking) {
        return res.redirect(`/bookings?date=${date}&error=Hai già una prenotazione per questa data`);
      }
  
      // Crea la nuova prenotazione
      await Booking.create({
        user: req.session.user.id,
        bookingDate,
        slot
      });
  
      res.redirect(`/bookings?date=${date}&success=Prenotazione effettuata con successo`);
    } catch (error) {
      console.error('Errore durante la creazione della prenotazione:', error);
      res.redirect('/bookings?error=Errore nella prenotazione');
    }
  };
  


module.exports = { getBookings, createBooking };