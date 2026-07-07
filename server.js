const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// ============= MIDDLEWARE SETUP =============

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'garda-bangsa-pb-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Global User for EJS Templates
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// ============= ROUTES =============

app.use('/', require('./routes/public'));
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));

// ============= ERROR HANDLING =============

app.use((req, res) => {
    res.status(404).render('errors/404', { title: 'Halaman Tidak Ditemukan' });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).render('errors/500', {
        title: 'Terjadi Kesalahan',
        message: process.env.NODE_ENV === 'production'
            ? 'Terjadi kesalahan pada server'
            : err.message
    });
});

// ============= SERVER START =============

app.listen(port, () => {
    console.log(`\n✅ Server Garda Bangsa Papua Barat berjalan di http://localhost:${port}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️  Database: ${process.env.SUPABASE_URL ? 'Connected' : 'Not Configured'}\n`);
});

module.exports = app;
