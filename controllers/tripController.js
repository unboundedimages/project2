var db = require("../models");
var express = require("express");
var router = express.Router();
var axios = require("axios");
var path = require("path");
var authKey = "c79c9c57fca6d026";


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
router.get("/results", function(req, res) {
    db.SearchLocation.findAll({}).then(function(data) {
        console.log("DATA CONSOLE: " + data);
        var hbsObject = {
            // History: data,
            // Image: data,
            searchHistory: data,
            lastSearch: data[data.length - 1]
        };
        console.log(hbsObject);

        res.render("dashboard", hbsObject);

    });
});

router.post("/api/newSearch", function(req, res) {
    console.log("this is working(ish)");
    // reassign variable here
    axios({
        method: 'get',
        url: 'https://api.wunderground.com/api/' + authKey + '/history_' + req.body.date + '/q/' + req.body.state + '/' + req.body.city + '.json'
    }).then(function(axiosResults) {
        console.log(axiosResults.data.history.observations[5].tempi);
        db.SearchLocation.create({
            date: req.body.date,
            state: req.body.state,
            city: req.body.city,
            precipitation: axiosResults.data.history.observations[10].conds,
            temperature: axiosResults.data.history.observations[10].tempi,
            humidity: axiosResults.data.history.observations[10].hum
        }).then(function(databaseResult) {
            res.json(databaseResult);
        });
    });

    // axios({
    //     method: 'get',
    //     url: 'https://api.wunderground.com/api/' + authKey + '/satellite/q/' + req.body.state + '/' + req.body.city + '.json'
    // }).then(function(axiosResults) {
    //     console.log(axiosResults.data.satellite.image_url);
    //     db.SearchLocation.create({
    //         image: axiosResults.data.satellite.image_url
    //     }).then(function(databaseResult) {
    //         res.json(databaseResult);
    //     });
    // });

});

router.delete("/results/delete/:id", function(req, res) {
    db.SearchLocation.destroy({
        where: {
            id: req.params.id
        }
    }).then(function(results) {
        res.json(results);
    });
});

module.exports = router;
