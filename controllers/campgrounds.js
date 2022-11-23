const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const { cloudinary } = require('../cloudinary')
var moment = require('moment')


module.exports.index = async (request, response) => {
    const campgrounds = await Campground.find({});
    response.render('campgrounds/index', { campgrounds })
    }

module.exports.renderNewForm = (request, response) => {
    response.render('campgrounds/new');
}

module.exports.createCamp = async (request, response, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: request.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(request.body.campground);
    campground.geometry = geoData.body.features[0].geometry
    campground.images = request.files.map(file => ({url: file.path, filename: file.filename}))
    campground.author = request.user._id
    await campground.save();
    console.log(campground);
    request.flash('success', 'Successfully made a new campground!');
    response.redirect(`/campgrounds/${campground._id}`)
}

module.exports.renderShow = async (request, response) => {
    const campground = await Campground.findById(request.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if(!campground) {
        request.flash('error', 'Oops! That campground does not exist anymore.')
        return response.redirect('/campgrounds')
    }
    response.render('campgrounds/show', {campground, moment: moment} )
}

module.exports.renderEditForm = async (request, response) => {
    const { id } = request.params;
    const campground = await Campground.findById(id)
    if(!campground) {
        request.flash('error', 'Oops! That campground does not exist anymore.')
        return response.redirect('/campgrounds')
    }
    response.render('campgrounds/edit', {campground})
}

module.exports.updateCamp = async (request, response) => {
    const { id } = request.params;
    const geoData = await geocoder.forwardGeocode({
        query: request.body.campground.location,
        limit: 1
    }).send()
    const campground = await Campground.findByIdAndUpdate(id, {...request.body.campground}, {geometry: geoData.body.features[0].geometry});
    const imgs = request.files.map(file => ({url: file.path, filename: file.filename}))
    campground.images.push(...imgs)
    await campground.save()
    if(request.body.deleteImages) {
        for(let filename of request.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: {images: { filename: { $in: request.body.deleteImages }}}})
        console.log(campground);
    }
    request.flash('success', 'Successfully updated campground!');
    response.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCamp = async (request, response) => {
    const { id } = request.params;
    await Campground.findByIdAndDelete(id);
    request.flash('success', 'Successfully deleted campground.');
    response.redirect('/campgrounds')
}