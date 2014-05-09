(function($beerApp, $angular) {

    /**
     * @controller BeerController
     * @param $scope {Object}
     */
    $beerApp.controller('BeerController', function beerController($scope, $http, $interpolate, BeerAPI) {

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

        // Fetch the beers, sunshine!
        $scope.request('beers.json', function success(response) {

        });

    });

})(window.beerApp, window.angular);