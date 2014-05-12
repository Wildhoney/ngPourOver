(function ngPourOver($angular) {

    "use strict";

    // Bootstrap our ngPourOver module!
    var poApp = $angular.module('ngPourOver', []);

    /**
     * @service ngPourOver
     * @param $window {Object}
     */
    poApp.service('PourOver', ['$window', function ngPourOverCollection($window) {

        /**
         * @property P
         * @type {Object}
         */
        var P = $window.PourOver;

        /**
         * @function ngPourOver
         * @constructor
         */
        var service = function ngPourOverCollection(collection) {

            // Drop the collection into a PourOver collection.
            this._collection = new P.Collection(collection);

        };

        service.prototype = {

            /**
             * @constant DEFAULT_TYPE
             * @type {String}
             * @default "and"
             */
            DEFAULT_TYPE: 'and',

            /**
             * @property _collection
             * @type {Array}
             * @private
             */
            _collection: [],

            /**
             * @property filters
             * @type {Array}
             * @private
             */
            _filters: [],

            /**
             * @method addExactFilter
             * @param property {String}
             * @param values {Array}
             * @return {void}
             */
            addExactFilter: function addExactFilter(property, values) {
                this.addFilter('makeExactFilter', property, values);
            },

            /**
             * @method addInclusionFilter
             * @param property {String}
             * @param values {Array}
             * @return {void}
             */
            addInclusionFilter: function addInclusionFilter(property, values) {
                this.addFilter('makeInclusionFilter', property, values);
            },

            /**
             * @method addFilter
             * @param type {String}
             * @param property {String}
             * @param values {Array}
             * @return {void}
             */
            addFilter: function addFilter(type, property, values) {
                var filter = P[type](property, values || this._fetchProperties(property));
                this._collection.addFilters([filter]);
            },

            /**
             * @method addItem
             * @param model {Object}
             * @return {void}
             */
            addItem: function addItem(model) {
                this._collection.addItems([model]);
            },

            /**
             * @method filterBy
             * @param property {String}
             * @param value {Array}
             * @param type {String}
             * @return {void}
             */
            filterBy: function filterBy(property, value, type) {

                // Assume the default type if none specified.
                type = type || this.DEFAULT_TYPE;

                // Determine if the filtering technique is of a valid type.
                if (!_.contains(['and', 'or', 'not'], type)) {
                    throw "ngPourOver: Type '" + type + "' is not of valid filter types: and, or, not.";
                }

                // Determine if this filter is actually set.
                if (typeof this._collection.filters[property] === 'undefined') {
                    throw "ngPourOver: Filter '" + property + "' hasn't yet been defined.";
                }

                this._collection.filters[property].query(value);
                this._filters[property] = type;

            },

            /**
             * @property unfilterBy
             * @param property {String}
             * @return {void}
             */
            unfilterBy: function unfilterBy(property) {
                this._collection.filters[property].query([]);
                delete this._filters[property];
            },

            /**
             * @method _fetchProperties
             * @param property {String}
             * @return {Array}
             * @private
             */
            _fetchProperties: function _fetchProperties(property) {

                var properties = _.pluck(this._collection.items, property);

                // Determine if we're dealing with properties that are arrays.
                var propertiesAreArrays = _.every(properties, function every(property) {
                    return _.isArray(property);
                });

                // If the above resolves to true then we need to flatten them for PourOver.
                if (propertiesAreArrays) {
                    properties = _.flatten(properties);
                }

                return properties;

            }

        };

        return service;

    }]);

    /**
     * @filter pourOverFilter
     */
    poApp.filter('poCollection', function poCollection() {

        /**
         * @method poCollectionFilter
         * @param pourOver {ngPourOverCollection}
         * @return {Array}
         */
        return function poCollectionFilter(pourOver) {

            var filters = pourOver._collection.filters,
                query   = null;

            // Iterate over each defined filter.
            _.forEach(filters, function forEach(filter, property) {

                // Determine if this filter is actually set.
                if (typeof pourOver._filters[property] === 'undefined') {
                    return;
                }

                var currentQuery = filter['current_query'];

                if (!query) {

                    // We don't have a query yet, so let's start at the beginning.
                    query = currentQuery;
                    return;

                }

                // Otherwise we'll begin chaining the queries together.
                var type = pourOver._filters[property];
                query    = query[type](currentQuery);

            });

            // Load current collection into a PourOver view.
            var view = new PourOver.View('defaultView', pourOver._collection);
            return view.getCurrentItems();

        };

    });

})(window.angular);