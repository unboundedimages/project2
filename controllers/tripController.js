var db = require("../models");
var express = require("express");
var router = express.Router();


//index handlebars, user log in
router.get('/', function(req, res) {
    res.render("index");
});

router.post("/api/userData", function(req, res) {
    db.User.create([
            "***"
            ]).then(function(results) {
        res.json(results);
    });
});


//dashboard handlebars, city search
// router.get("/results", function(req, res) {
//     res.render("dashboard");
// });

router.get("/results", function(req, res) {
    db.SearchLocation.findAll({}).then(function(data) {
        res.render("dashboard", { City: data });
    });
});

router.post("/results", function(req, res) {
    db.SearchLocation.create({
        city: req.body.city,
        // state: req.body.state,
        // date: req.body.date
    }).then(function(results) {
        res.json(results);
    });
});

router.delete("/results/:id", function(req, res) {
    db.SearchLocation.destroy({
        where: {
            id: req.params.id
        }
    }).then(function(results) {
        res.json(results);
    });
});


module.exports = router;
