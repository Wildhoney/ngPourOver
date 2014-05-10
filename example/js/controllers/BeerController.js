(function($beerApp, $angular) {

    "use strict";

    /**
     * @controller BeerController
     * @param $scope {Object}
     */
    $beerApp.controller('BeerController', function beerController($scope, $http, $interpolate, PourOver, BeerAPI) {

        /**
         * @method request
         * @param path {String}
         * @param params {Object}
         * @return {Object}
         */
        $scope.request = function request(path, params) {

            // Construct the URL for the Beer API request!
            var url = $interpolate('{{url}}/{{path}}?token={{token}}')({
                url: BeerAPI.URL, path: path, token: BeerAPI.TOKEN
            });

            // Initialise the AJAX request for the data!
            return $http.get(url, params || {});

        };

        var people = [
            { name: 'Adam' },
            { name: 'Maria' },
            { name: 'Artem' },
            { name: 'Gabriele' }
        ];

        $scope.collection = new PourOver(people);
        $scope.collection.addExactFilter('name', ['Adam', 'Maria']);
//        $scope.collection.applyFilter('name', 'Adam');

        // Fetch the beers, sunshine!
//        $scope.request('beers.json', function success(response) {
//
//        });

    });

})(window.beerApp, window.angular);