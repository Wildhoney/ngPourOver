(function ngPourOver($window, $angular) {

    "use strict";

    // Bootstrap our ngPourOver module!
    var poApp = $angular.module('ngPourOver', []);

    /**
     * @property P
     * @type {Object}
     */
    var P = $window.PourOver;

    /**
     * @service ngPourOver
     * @param $window {Object}
     */
    poApp.service('PourOver', function ngPourOverCollection() {

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
             * @property _sortBy
             * @type {String|null}
             * @private
             */
            _sortBy: null,

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
             * @method addSort
             * @param name {String}
             * @param options {Object}
             * @return {void}
             */
            addSort: function addSort(name, options) {
                var SortingAlgorithm = P.Sort.extend(options);
                this._collection.addSorts([new SortingAlgorithm(name)]);
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
             * @method sortBy
             * @param property {String}
             * @return {void}
             */
            sortBy: function sortBy(property) {
                this._sortBy = property;
            },

            /**
             * @method unsortBy
             * @return {void}
             */
            unsort: function unsort() {
                this._sortBy = null;
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

    });

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

            // Load current collection into a PourOver view.
            var view    = new P.View('defaultView', pourOver._collection, { page_size: 1 }),
                query   = view.match_set,
                filters = pourOver._collection.filters;

            if (pourOver._sortBy) {

                // Define the sort by algorithm.
                view.setSort(pourOver._sortBy);

            }

            // Iterate over each defined filter.
            _.forEach(filters, function forEach(filter, property) {

                // Determine if this filter is actually set.
                if (typeof pourOver._filters[property] === 'undefined') {
                    return;
                }

                var currentQuery = filter['current_query'];

                // Otherwise we'll begin chaining the queries together.
                var type = pourOver._filters[property];
                query    = query[type](currentQuery);

            });

            // Update the match set with our defined query, and then return the collection.
            view.match_set = query;
            return view.getCurrentItems();

        };

    });

})(window, window.angular);