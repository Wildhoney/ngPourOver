(function($beerApp, $angular) {

    "use strict";

    /**
     * @controller BeerController
     * @param $scope {Object}
     */
    $beerApp.controller('BeerController', function beerController($scope, $http, PourOver) {

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

        var people = [
            { name: 'Adam',         age: 12,    likes: ['cats', 'hedgehogs'] },
            { name: 'Maria',        age: 23,    likes: ['cats', 'tortoises'] },
            { name: 'Artem',        age: 16,    likes: ['dogs'] },
            { name: 'Adam',         age: 25,    likes: ['cats', 'hedgehogs'] },
            { name: 'Gabriele',     age: 33,    likes: ['dogs', 'cats'] }
        ];

        $scope.collection = new PourOver(people);

        $scope.collection.addExactFilter('name');
        $scope.collection.addExactFilter('age');
        $scope.collection.addInclusionFilter('likes');
//        $scope.collection.addItem({ name: 'Galina', age: 23 });

        // Fetch the beers, sunshine!
        $scope.request('beers', function success(response) {
            console.log(response);
        });

    });

})(window.beerApp, window.angular);