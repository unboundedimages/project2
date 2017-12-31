var db = require("../models");
var express = require("express");
var router = express.Router();
var axios = require("axios");
var path = require("path");
var authKey = "c79c9c57fca6d026";


//index handlebars, user log in
// router.get('/', function(req, res) {
//     res.render("index");
// });

// router.post("/api/userData", function(req, res) {
//     db.User.create([
//         "***"
//     ]).then(function(results) {
//         res.json(results);
//     });
// });

//dashboard handlebars, city search
router.get("/results", function(req, res) {
    db.SearchLocation.findAll({}).then(function(data) {
        console.log("DATA CONSOLE: " + data);
        var hbsObject = {
            searchHistory: data,
            lastSearch: data[data.length - 1]
        };
        console.log(hbsObject);

        res.render("dashboard", hbsObject);
    });
});

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
                hum10: year2005.data.history.observations[10].hum,
                hum15: year2005.data.history.observations[10].hum,
                image: image.data.satellite.image_url,
                todayDate: forecast.data.forecast.simpleforecast.forecastday[0].date.pretty,
                todayHigh: forecast.data.forecast.simpleforecast.forecastday[0].high.fahrenheit,
                todayLow: forecast.data.forecast.simpleforecast.forecastday[0].low.fahrenheit,
                todayConds: forecast.data.forecast.simpleforecast.forecastday[0].conditions
            }).then(function(databaseResult) {
                res.json(databaseResult);
            });
        }));


    // console.log("this is working(ish)");
    // // reassign variable here
    // axios({
    //     method: 'get',
    //     url: 'https://api.wunderground.com/api/' + authKey + '/history_' + req.body.date + '/q/' + req.body.state + '/' + req.body.city + '.json'
    // }).then(function(axiosResults) {
    //     console.log(axiosResults.data.history.observations[5].tempi);
    //     db.SearchLocation.create({
    //         date: req.body.date,
    //         state: req.body.state,
    //         city: req.body.city,
    //         // precipitation: axiosResults.data.history.observations[10].conds,
    //         precipitation: axiosResults.data.history.observations[10].rain,
    //         temperature: axiosResults.data.history.observations[10].tempi,
    //         humidity: axiosResults.data.history.observations[10].hum
    //     }).then(function(databaseResult) {
    //         res.json(databaseResult);
    //     });
    // });

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
