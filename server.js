//Sets up Node and Express
var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;


// Sets up the Express app to handle data parsing
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(express.static("public"));


// Sets up Express Engine Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Routes
// =============================================================
var routes = require("./controllers/tripController.js");
//what is routes pointing to?  That folder doesnt exist
//to handle middleware use app.use(express.static("public"));
//doc ref = http://expressjs.com/en/starter/static-files.html
app.use("/", routes);


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
