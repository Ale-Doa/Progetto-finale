require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const bookingsRoutes = require('./routes/bookingsRoutes');
const { isPremium } = require('./utils');
const { getDashboard } = require('./controllers/dashboardController');

const app = express();

// Connessione DB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

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

app.get('/', (req, res) => res.redirect('/auth/login'));
app.get('/dashboard', getDashboard, (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
    res.render('dashboard', {
        user: req.session.user,
        isPremium: isPremium // Passiamo la funzione helper alla view
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));