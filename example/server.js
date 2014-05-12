(function($process) {

    "use strict";

    var express     = require('express'),
        app         = express(),
        util        = require('util'),
        httpRequest = require('request');

    // Brewery API data.
    var BREWERY_API = {
        URL:   'http://api.brewerydb.com/v2/%s/?key=%s&%s',
        TOKEN: '5b673ae86f680065691d573da748059e'
    };

    // Begin Express so the statistics are available from the `localPort`.
    app.use(express.static(__dirname));
    app.listen($process.env.PORT || 3001);

    app.get('/beers', function getBeers(request, response) {

        var url = util.format(BREWERY_API.URL, 'beers', BREWERY_API.TOKEN, 'ibu=50');

        httpRequest(url, function request(error, feedback, data) {
            response.send(data);
        });

    });

})(process);