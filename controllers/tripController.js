var db = require("../models");
var express = require("express");
var router = express.Router();
var axios = require("axios");
var path = require("path");
var authKey = "c79c9c57fca6d026";


//Display dashboard page with results of search to client
//=============================================
router.get("/results", function(req, res) {
    if (!req.user) {
        res.redirect("/signin")
    }
    db.SearchLocation.findAll({
        where: {
            userId: req.user.id
        }
    }).then(function(data) {
        console.log("DATA CONSOLE: " + data);

        var hbsObject = {
            userName: req.user.firstname,
            searchHistory: data,
            lastSearch: data[data.length - 1]
        };
        console.log(hbsObject);

        res.render("dashboard", hbsObject);
    });
});

//Allow user to flip back through prior searches
//===============================================
router.get("/results/priorsearch/:id", function(req, res) {
    db.SearchLocation.findAll({
        where: {
            userId: req.user.id
        }
    }).then(function(data) {
        for (var i = 0; i < data.length; i++) {
            console.log("req.param " + req.params.id);
            console.log("data test1: " + data[i].dataValues.id);
            var selectedId = data[i].dataValues.id;
            if (selectedId == req.params.id) {
                var searchResult = data[i];
                console.log("this is equal");
                console.log("This is the result: " + searchResult);
            }
            // console.log("Prior search:" + "0%", data);
            var hbsObject = {
                userName: req.user.firstname,
                searchHistory: data,
                lastSearch: searchResult
            };
        }
        // console.log(hbsObject);
        res.render("dashboard", hbsObject);
    });
});


//Post results of search to server
//=============================================
router.post("/api/newSearch", function(req, res) {
    console.log(req.body.date);

    function getYear2005() {
        return axios.get('https://api.wunderground.com/api/' + authKey + '/history_2005' + req.body.date + '15/q/' + req.body.state + '/' + req.body.city + '.json');
    }

    function getYear2010() {
        return axios.get('https://api.wunderground.com/api/' + authKey + '/history_2010' + req.body.date + '15/q/' + req.body.state + '/' + req.body.city + '.json');
    }

    function getYear2015() {
        return axios.get('https://api.wunderground.com/api/' + authKey + '/history_2015' + req.body.date + '15/q/' + req.body.state + '/' + req.body.city + '.json');
    }

    function getImage() {
        return axios.get('https://api.wunderground.com/api/' + authKey + '/satellite/q/' + req.body.state + '/' + req.body.city + '.json');
    }

    function getForecast() {
        return axios.get('http://api.wunderground.com/api/' + authKey + '/forecast/q/' + req.body.state + '/' + req.body.city + '.json');
    }


    axios.all([getYear2005(), getYear2010(), getYear2015(), getImage(), getForecast()])
        .then(axios.spread(function(year2005, year2010, year2015, image, forecast) {

            console.log("***************************")
            console.log("%0", year2005.data.history.dailysummary)
            console.log("***************************")

            db.SearchLocation.create({
                date: req.body.date,
                state: req.body.state,
                city: req.body.city,
                monthFormat: year2005.data.history.observations[10].date.mon,
                dayFormat: year2005.data.history.observations[10].date.mday,
                conds05: year2005.data.history.observations[10].conds,
                conds10: year2010.data.history.observations[10].conds,
                conds15: year2015.data.history.observations[10].conds,
                highTemp05: year2005.data.history.dailysummary[0].maxtempi,
                lowTemp05: year2005.data.history.dailysummary[0].mintempi,
                highTemp10: year2010.data.history.dailysummary[0].maxtempi,
                lowTemp10: year2010.data.history.dailysummary[0].mintempi,
                highTemp15: year2015.data.history.dailysummary[0].maxtempi,
                lowTemp15: year2015.data.history.dailysummary[0].mintempi,
                hum05: year2005.data.history.observations[10].hum,
                hum10: year2010.data.history.observations[10].hum,
                hum15: year2015.data.history.observations[10].hum,
                image: image.data.satellite.image_url,
                todayDate: forecast.data.forecast.simpleforecast.forecastday[0].date.pretty,
                todayHigh: forecast.data.forecast.simpleforecast.forecastday[0].high.fahrenheit,
                todayLow: forecast.data.forecast.simpleforecast.forecastday[0].low.fahrenheit,
                todayConds: forecast.data.forecast.simpleforecast.forecastday[0].conditions,
                userId: req.user.id
            }).then(function(databaseResult) {
                res.json(databaseResult);
            });
        }));
});


//Delete a searched city in history field on client
//=============================================
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
