const User = require('../models/user')

module.exports.renderRegister = (request, response) => {
    response.render('users/register')
}

module.exports.createUser = async(request, response, next) => {
    try{
        const { email, username, password } = request.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        request.login(registeredUser, err => {
            if(err) return next(err);
            request.flash('success', 'Welcome!');
            response.redirect('/campgrounds')
        })
        
    } catch(e) {
        request.flash('error', e.message);
        response.redirect('register')
    }
    
}

module.exports.renderLogin = (request, response) => {
    response.render('users/login')
}

module.exports.userLogin = (request, response) => {
   request.flash('success', 'Welcome Back to April Camp!');
   const redirectUrl = request.session.returnTo || '/campgrounds';
   response.redirect(redirectUrl);
}

module.exports.userLogout = (request, response) => {
    request.logout(err => {
        if (err) { return next(err); }    
        request.flash('success', 'You are alredy logged out.')
        response.redirect('/campgrounds')
    })
}