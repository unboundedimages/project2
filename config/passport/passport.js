var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport, user) {
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // initialize the passport-local strategy, and the user model, which will be passed as an argument//
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    var User = user;
    var LocalStrategy = require('passport-local').Strategy;
    /////////////////////////////////////////////////////////////////////////
    //we define our custom strategy with our instance of the LocalStrategy //
    /////////////////////////////////////////////////////////////////////////
    passport.use('local-signup', new LocalStrategy(

        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback

        }, //add callback function
        function(req, email, password, done) {
            // generateHash will generate the hashed password
            var generateHash = function(password) {

                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);

            };
            //check to see if the user already exists, and if not we add them.
            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
                if (user) {
                    return done(null, false, {
                        message: 'That email is already taken'
                    });
                }
                else {
                    var userPassword = generateHash(password);
                    var data = {
                        email: email,
                        password: userPassword,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname
                    };
                    User.create(data).then(function(newUser, created) {
                        if (!newUser) {
                            return done(null, false);
                        }
                        if (newUser) {
                            return done(null, newUser);
                        }
                    });
                }
            });
        }
    ));
    //To solve the porblem of getting a "Failed to serialize user into sesson"
    // a serialize and deserialize function is created. The serialize is used to
    // save the user id to the session
    //serialize
    passport.serializeUser(function(user, done) {

        done(null, user.id);

    });
    // deserialize user
    passport.deserializeUser(function(id, done) {
        // we use the Sequelize findById promise to get the user
        User.findById(id).then(function(user) {

            if (user) {
                // To get the User object from this instance,
                // we use the Sequelize getter function like this: user.get().
                done(null, user.get());

            }
            else {

                done(user.errors, null);

            }

        });

    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    //---------------------------------------// LOCAL SIGNIN  //----------------------------------------//

    //////////////////////////////////////////////////////////////////////////////////////////////////////

    //LOCAL SIGNIN
    passport.use('local-signin', new LocalStrategy(

        {
            // by default, local strategy uses username and password, we will override with email

            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback

        },

        function(req, email, password, done) {
            // the isValidPassword function compares the password entered with
            // the bCrypt comparison method since we stored our password with bcrypt.
            var User = user;
            var isValidPassword = function(userpass, password) {
                return bCrypt.compareSync(password, userpass);
            };

            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
                if (!user) {
                    return done(null, false, {
                        message: 'Email does not exist'
                    });
                }

                if (!isValidPassword(user.password, password)) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }

                var userinfo = user.get();
                return done(null, userinfo);

            }).catch(function(err) {
                console.log("Error:", err);
                return done(null, false, {
                    message: 'Something went wrong with your Signin'
                });
            });
        }
    ));


}; //end of module.export
