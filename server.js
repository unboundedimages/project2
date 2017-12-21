//Sets up Node and Express
var express = require("express");
var app = express();
var passport = require('passport');
var session = require('express-session');
var bodyParser = require("body-parser");
var env = require('dotenv').load();
var exphbs = require('express-handlebars');
var PORT = process.env.PORT || 8080;





// Sets up the Express app to handle data parsing

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(express.static("public"));

// For Passport
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions




// Sets up Express Engine Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

/////////// ALTERNATE PER PASSPORT DOCS TO HANDLE AUTH //////////////
//For Handlebars
app.set('views', './views');
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');
///////////////////////////////////////////////////////////////////
app.get('/', function(req, res) {
    res.send('Welcome to Passport with Sequelize');
});

//Models
var models = require("./models");


// Routes
// =============================================================
var authRoute = require('./routes/auth.js')(app, passport);
var routes = require("./controllers/tripController.js");

//load passport strategies
require('./config/passport/passport.js')(passport, models.user);


//Sync Database
models.sequelize.sync().then(function() {
    console.log('Nice! Database looks fine');
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!");
});
app.listen(5000, function(err) {
    if (!err)
        console.log("Site is live");
    else console.log(err);
});


//what is routes pointing to?  That folder doesnt exist
//to handle middleware use app.use(express.static("public"));
//doc ref = http://expressjs.com/en/starter/static-files.html
app.use("/", routes);
// app.use(express.static("public"));

// Syncing our sequelize models and then starting our Express app
// =============================================================
// var db = require is in the wrong file.  It belongs in the
// controller file, i.e. tripControlloer.js unless this
// is here for testing another page.
var db = require("./models");
db.sequelize.sync({ force: false }).then(function() {
    app.listen(PORT, function() {
        console.log("App listening on PORT " + PORT);
    });
});
