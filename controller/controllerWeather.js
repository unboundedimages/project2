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
    //reassign variable here
    axios({
        method: 'get',
        url: 'http://api.wunderground.com/api/' + authKey + 'history_' + req.body.date + '/q/' + req.body.state + '/' + req.body.city + '.json'
    }).then(function(axiosResults) {
        console.log(axiosResults);
        db.SearchLocation.create({
            date: req.body.date,
            state: req.body.state,
            city: req.body.city
        }).then(function(databaseResult) {
            res.json(databaseResult);
        });

    });
});

module.exports = router;
