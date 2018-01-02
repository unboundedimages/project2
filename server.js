//Sets up Node and Express
var express = require("express");
var app = express();
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var env = require('dotenv').load();
var exphbs = require('express-handlebars');
var PORT = process.env.PORT || 8080;

////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
/////////////////  MIDDLEWARE  ///////////////////////////

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// For Passport
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
//For Handlebars
app.set('views', './views');
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set('view engine', '.hbs');
app.set("view engine", "handlebars");
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(express.static("public"));

///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
// models will communicated with index.js and users.js
var models = require("./models");
var authRoute = require('./routes/auth.js')(app, passport);
require('./config/passport/passport.js')(passport, models.user);
//////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
models.sequelize.sync({ force: true }).then(function() {
    console.log("Successful sync to tripPlanner database ------------");
    app.listen(PORT, function() {
        console.log("App listening on PORT " + PORT);
    });
});
app.listen(5000, function(err) {

    if (!err)
        console.log("Site is live");
    else console.log(err);

});

// Sets up Express Engine Handlebars
///////////////////////////////////////////////////////////////////////
// res.send was renamed to .redirect('/signin'); for the landing page//
///////////////////////////////////////////////////////////////////////
app.get('/', function(req, res) {
    res.redirect('/signin');
});



// Routes
// =============================================================
var routes = require("./controllers/tripController.js");
app.use("/", routes);
// Syncing our sequelize models and then starting our Express app
// =============================================================
var db = models;
