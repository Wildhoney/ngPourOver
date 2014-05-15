(function($process) {

    "use strict";

    var express     = require('express'),
        app         = express(),
        util        = require('util');

    // Begin Express so the statistics are available from the `localPort`.
    app.use(express.static(__dirname));
    app.listen($process.env.PORT || 5001);

})(process);