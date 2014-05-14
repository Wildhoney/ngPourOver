(function($beerApp, $angular) {

    "use strict";

    /**
     * @controller WordsController
     * @param $scope {Object}
     */
    $beerApp.controller('WordsController', function wordsController($scope, $http, PourOver) {

        /**
         * @property collection
         * @type {Array}
         */
        $scope.collection = [];

        /**
         * @method request
         * @param path {String}
         * @param params {Object}
         * @return {Object}
         */
        $scope.request = function request(path, params) {

            // Initialise the AJAX request for the data!
            return $http.get(path, params || {});

        };

        $http.get('words.json').then(function then(response) {

            $scope.collection = new PourOver(response.data.splice(0, 50));
            $scope.collection.setDebug(true);
            $scope.collection.addExactFilter('word');
            $scope.collection.addSort('name', function(a, b) {
                if (a.word.toUpperCase() < b.word.toUpperCase()) return -1;
                if (a.word.toUpperCase() > b.word.toUpperCase()) return 1;
                return 0;
            });

        });

    });

})(window.beerApp, window.angular);