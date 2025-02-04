const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Booking = require('./Bookings')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
  membershipType: { type: String, enum: ['basic', 'premium1', 'premium3', 'premium6', 'premium12', 'admin'], default: 'basic' }
});

// Middleware pre-save per hash della password
userSchema.pre('save', async function (next) {
  try {
    if (!this.password) {
      console.warn('Password mancante durante il salvataggio dell\'utente');
      return next(new Error('Password obbligatoria'));
    }

    if (this.isModified('password') || this.isNew) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware post-save per cancellare le prenotazioni se l'abbonamento diventa "basic"
userSchema.post('save', async function (doc, next) {
  try {
    // Verifica se this.$original è definito (solo per aggiornamenti)
    if (this.$original && this.$original.membershipType !== doc.membershipType) {
      const previousMembershipType = this.$original.membershipType; // Vecchio tipo di abbonamento
      const currentMembershipType = doc.membershipType; // Nuovo tipo di abbonamento

      // Se l'abbonamento passa da premium a basic, cancella le prenotazioni
      if (
        ['premium1', 'premium3', 'premium6', 'premium12'].includes(previousMembershipType) &&
        currentMembershipType === 'basic'
      ) {
        await Booking.deleteMany({ user: doc._id });
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);