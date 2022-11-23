const express = require('express')
const router = express.Router()
const users = require('../controllers/users')
const passport = require('passport')
const catchAsync = require('../utils/catchAsync');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.createUser))

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect:'/login', keepSessionInfo:true}), users.userLogin)

// router.get('/register', users.renderRegister)

// router.post('/register', catchAsync(users.createUser))

// router.get('/login', users.renderLogin)

// router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect:'/login', keepSessionInfo:true}), users.userLogin)

router.get('/logout', users.userLogout)

module.exports = router