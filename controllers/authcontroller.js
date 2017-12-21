//controller for the signup route
//ref https://code.tutsplus.com/tutorials/using-passport-with-sequelize-and-mysql--cms-27537
var exports = module.exports = {};

exports.signup = function(req, res) {

    res.render('signup');

};
//above code points to the routes folder that has auth.js
//===============================================================
/////////////////////////////////////////////////////////////////

//this route is specific to sign in
//a controller for the sign-in

exports.signin = function(req, res) {

    res.render('signin');

};

//now back to the routes/auth.js
//=============================================================
////////////////////////////////////////////////////////////////


//dashboard controller
exports.dashboard = function(req, res) {

    res.render('dashboard');

};


//log out route to log the user out, and then protect the route
exports.logout = function(req, res) {

    req.session.destroy(function(err) {

        res.redirect('/');

    });

};
