(function($window, $angular) {

    "use strict";

    // Bootstrap our example application!
    var beerApp = $window.beerApp = $angular.module('beerApp', ['ngPourOver']);

    // URL and API token for el beer API!
    beerApp.constant('BeerAPI', {
        URL:   'http://api.openbeerdatabase.com/v1',
        TOKEN: 'f47bb0f5a257ea74eb08594b1bf34f025395ab760937bf2ea2ae3b47bdd36663'
    });

})(window, window.angular);