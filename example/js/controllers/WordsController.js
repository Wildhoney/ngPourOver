(function($beerApp, $angular) {

    "use strict";

    /**
     * @controller BeerController
     * @param $scope {Object}
     */
    $beerApp.controller('BeerController', function beerController($scope, $http, PourOver) {

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

            $scope.collection = new PourOver(response.data);
            $scope.collection.addExactFilter('word');
            $scope.collection.addSort('name', {
                attr: 'name',
                fn: function(a, b) {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                }
            });

        });

//        $scope.collection = new PourOver(people);
//        $scope.sortBy = 'name';
//
//        $scope.collection.addExactFilter('name');
//        $scope.collection.addExactFilter('age');
//        $scope.collection.addInclusionFilter('likes');
//
//
//        $scope.collection.addSort('age', {
//            attr: 'age',
//            fn: function(a, b) {
//                return a.age - b.age;
//            }
//        });

    });

})(window.beerApp, window.angular);