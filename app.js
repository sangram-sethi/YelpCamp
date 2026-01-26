if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');

const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const { connectDB, dbUrl } = require('./db');

// In serverless environments (like Vercel), this module can be loaded multiple times.
// connectDB() is written to cache the connection when the runtime stays warm.
connectDB().catch((err) => {
  console.error('Mongo connection error:', err);
});

const app = express();

// Views + templates
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Note: On Vercel, static assets are served from /public automatically.
// express.static() may be ignored in production, but it's useful for local dev.
app.use(express.static(path.join(process.cwd(), 'public')));

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret,
  },
});

store.on('error', function (e) {
  console.log('SESSION STORE ERROR', e);
});

const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    // secure cookies require HTTPS; Vercel provides it in production
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.set('trust proxy', 1);
app.use(session(sessionConfig));
app.use(flash());

// Security headers
app.use(helmet());

const scriptSrcUrls = [
  'https://stackpath.bootstrapcdn.com/',
  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
  'https://kit.fontawesome.com/',
  'https://cdnjs.cloudflare.com/',
  'https://cdn.jsdelivr.net/',
];
const styleSrcUrls = [
  'https://kit-free.fontawesome.com/',
  'https://stackpath.bootstrapcdn.com/',
  'https://api.mapbox.com/',
  'https://api.tiles.mapbox.com/',
  'https://fonts.googleapis.com/',
  'https://use.fontawesome.com/',
  'https://cdn.jsdelivr.net/',
];
const connectSrcUrls = [
  'https://api.mapbox.com/',
  'https://a.tiles.mapbox.com/',
  'https://b.tiles.mapbox.com/',
  'https://events.mapbox.com/',
];
const fontSrcUrls = [];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: [
        "'self'",
        'blob:',
        'data:',
        // Note: this is hard-coded to a specific Cloudinary account in the original project.
        // If you use a different Cloudinary cloud_name, update this allow-list accordingly.
        'https://res.cloudinary.com/',
        'https://images.unsplash.com/',
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Locals
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next();
});

// Routes
app.use('/', userRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);

app.get('/', (req, res) => {
  res.render('home');
});

// 404 handler
app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found', 404));
});

// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).render('error', { err });
});

// Export for Vercel (default export / CommonJS export)
module.exports = app;
