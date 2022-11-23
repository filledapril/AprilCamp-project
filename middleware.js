const { campgroundSchema, reviewSchema } = require('./JoiSchemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review')


module.exports.isLoggedIn = (request, response, next) => {
    if(!request.isAuthenticated()) {
        request.session.returnTo = request.originalUrl
        request.flash('error', 'You must be signed in frist.')
        return response.redirect('/login')
    }
    next()
}


module.exports.validateCampground = (request, response, next) => {
    const { error } = campgroundSchema.validate(request.body)
    if(error){
        const msg = error.details.map(d => d.message).join(',') 
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (request, response, next) => {
    const { id } = request.params;
    const campground = await Campground.findById(id)
    if(!campground.author.equals(request.user._id)){
        request.flash('error', 'Only the author can do that.')
        return response.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.validateReview = (request, response, next) => {
    const {error} = reviewSchema.validate(request.body);
    if (error) {
        const msg = error.details.map(d => d.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (request, response, next) => {
    const { id, reviewId } = request.params;
    const review = await Review.findById(reviewId)
    if(!review.author.equals(request.user._id)){
        request.flash('error', 'Only the author can do that.')
        return response.redirect(`/campgrounds/${id}`)
    }
    next();
}