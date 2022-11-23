const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const multer  = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCamp))


//GET ADD-NEW PAGE
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.renderShow))
    .put(isLoggedIn, isAuthor, upload.array('image'), catchAsync(campgrounds.updateCamp))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp))


//GET EDIT PAGE
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

//GET ALL 
// router.get('/', catchAsync(campgrounds.index))


//POST NEW DATA
// router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCamp))

//GET SINGLE DATA
// router.get('/:id', catchAsync(campgrounds.renderShow))



//Edit data POST as PUT
// router.put('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.updateCamp))

//DELETE SINGLE DATA
// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp))

module.exports = router