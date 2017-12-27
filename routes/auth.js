// a route for signup

var authController = require('../controllers/authcontroller.js');

module.exports = function(app, passport) {
    //signup
    app.get('/signup', authController.signup);

    //signin
    app.get('/signin', authController.signin);

    // the route for posting to /signup
    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/dashboard',

            failureRedirect: '/signup'
        }

    ));
    // /dashboard route
    app.get('/dashboard', isLoggedIn, authController.dashboard);

    //log out route to log the user out, and then protect the route
    app.get('/logout', authController.logout);


    // the route for posting to /signin.
    app.post('/signin', passport.authenticate('local-signin', {
            successRedirect: '/results',

            failureRedirect: '/signin'
        }

    ));

    // middleware to protect that route.
    function isLoggedIn(req, res, next) {

        if (req.isAuthenticated())

            return next();

        res.redirect('/signin');

    }

};
