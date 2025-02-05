require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const bookingsRoutes = require('./routes/bookingsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { isPremium } = require('./utils');
const { getDashboard } = require('./controllers/dashboardController');
const { getAdminDashboard } = require('./controllers/adminController');

const app = express();

// Connessione DB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// Routes
app.use('/auth', authRoutes);
app.use('/bookings', bookingsRoutes);
app.use('/admin', adminRoutes);

// Root route (Home Page)
app.get('/', (req, res) => {
  res.render('home', { user: req.session.user || null}); // Passa l'utente loggato alla view
});

app.get('/', (req, res) => res.redirect('/auth/login'));
// Route per la dashboard
app.get('/dashboard', async (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
  
    try {
      // Verifica se l'utente è admin
      if (req.session.user.membershipType === 'admin') {
        return getAdminDashboard(req, res); // Usa la dashboard admin
      }
  
      // Altrimenti usa la dashboard standard
      return getDashboard(req, res);
    } catch (error) {
      console.error('Errore durante il caricamento della dashboard:', error);
      res.status(500).send('Qualcosa è andato storto!');
    }
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));