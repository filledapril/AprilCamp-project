require('dotenv').config()
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session')
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize');

// ROUTES
const campgroundRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


const app = express();
app.use(express.json())

//ejs view setting
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize());


// Session & flash
const sessionConfig = {
    name: 'session',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}   
app.use(session(sessionConfig))
app.use(flash());
// app.use(helmet());



//passportjs
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((request, response, next) => {
    response.locals.currentUser = request.user;
    response.locals.success = request.flash('success');
    response.locals.error = request.flash('error');
    next();
})

// USE ROUTES
app.use('/', usersRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)


//Home view
app.get('/', (req, res) => {
    res.render('home')
})

//unknown endpoint 404
app.all('*', (request, response, next) => {
    next(new ExpressError('Page Not Found', 404))
})

// error handler
app.use((err, request, response, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oops That&apo;s a Error!'
    response.status(statusCode).render('error', {err})
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`)
})