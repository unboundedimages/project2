var axios = require("axios");
var express = require("express");
var router = express.Router();
var db = require("../models");
var path = require("path");

var authKey = "c79c9c57fca6d026";

router.get("/html", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/test.html"));
    console.log("test");
});

router.post("/html", function(req, res) {
    console.log("this is working(ish)");
    // reassign variable here
    axios({
        method: 'get',
        url: 'https://api.wunderground.com/api/' + authKey + '/history_' + req.body.userDate + '/q/' + req.body.userState + '/' + req.body.userCity + '.json'
    }).then(function(axiosResults) {
        console.log(axiosResults.data.history.observations[5]);
        db.SearchLocation.create({
            date: req.body.userDate,
            state: req.body.userState,
            city: req.body.userCity
        }).then(function(databaseResult) {
            res.json(databaseResult);
        });

    });
});

module.exports = router;
