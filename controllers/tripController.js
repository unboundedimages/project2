var db = require("../models");
var express = require("express");
var router = express.Router();
var axios = require("axios");
var path = require("path");
var authKey = "c79c9c57fca6d026";


//Display dashboard page with results of search to client
//=============================================
router.get("/results", function(req, res) {
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
            id: req.params.id
        }
    }).then(function(results) {
        console.log("Prior search:" + results);
        // res.render("dashboard", hbsObject);
    });
});


//Post results of search to server
//=============================================
router.post("/api/newSearch", function(req, res) {
    console.log(req.body.date);

    function getYear2005() {
        return axios.get('https://api.wunderground.com/api/' + authKey + '/history_2005' + req.body.date + '/q/' + req.body.state + '/' + req.body.city + '.json');
    }

    function getYear2010() {
        return axios.get('https://api.wunderground.com/api/' + authKey + '/history_2010' + req.body.date + '/q/' + req.body.state + '/' + req.body.city + '.json');
    }

    function getYear2015() {
        return axios.get('https://api.wunderground.com/api/' + authKey + '/history_2015' + req.body.date + '/q/' + req.body.state + '/' + req.body.city + '.json');
    }

    function getImage() {
        return axios.get('https://api.wunderground.com/api/' + authKey + '/satellite/q/' + req.body.state + '/' + req.body.city + '.json');
    }

    function getForecast() {
        return axios.get('http://api.wunderground.com/api/' + authKey + '/forecast/q/' + req.body.state + '/' + req.body.city + '.json');
    }


    axios.all([getYear2005(), getYear2010(), getYear2015(), getImage(), getForecast()])
        .then(axios.spread(function(year2005, year2010, year2015, image, forecast) {

            db.SearchLocation.create({
                date: req.body.date,
                state: req.body.state,
                city: req.body.city,
                conds05: year2005.data.history.observations[10].conds,
                conds10: year2010.data.history.observations[10].conds,
                conds15: year2015.data.history.observations[10].conds,
                temp05: year2005.data.history.observations[10].tempi,
                temp10: year2010.data.history.observations[10].tempi,
                temp15: year2015.data.history.observations[10].tempi,
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
