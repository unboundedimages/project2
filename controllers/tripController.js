var db = require("../models");
var express = require("express");
var router = express.Router();


//index handlebars, user log in
router.get('/login', function(req, res) {
    res.render("index");
});

router.post("/api/userData", function(req, res) {
    db.User.create([
            "***"
            ]),
        function(results) {
            res.json(results);
        };
});


//dashboard handlebars, city search
router.get('/results', function(req, res) {
    res.render("dashboard");
});

router.post("api/cityData", function(req, res) {
    db.SearchLocation.create([
            "****"
            ]),
        function(results) {
            res.json(results);
        };
});
