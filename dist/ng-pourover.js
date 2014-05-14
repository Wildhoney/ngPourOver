(function ngPourOver($window, $angular, $console) {

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
             * @property _sortAscending
             * @type {Boolean}
             * @default true
             */
            _sortAscending: true,

            /**
             * @property _debug
             * @type {Boolean}
             * @default false
             */
            _debug: false,

            /**
             * @property perPage
             * @type {Number}
             * @default Infinity
             */
            _perPage: Infinity,

            /**
             * @property _pageNumber
             * @type {Number}
             * @default 1
             */
            _pageNumber: 1,

            /**
             * @method setDebug
             * @param enabled {Boolean}
             * @return {void}
             */
            setDebug: function setDebug(enabled) {
                this._debug = enabled;
            },

            /**
             * @method setPageNumber
             * @param pageNumber {Number}
             * @return {void}
             */
            setPageNumber: function setPageNumber(pageNumber) {
                this._pageNumber = pageNumber;
            },

            /**
             * @method setPerPage
             * @param perPage {Number}
             * @return {void}
             */
            setPerPage: function setPerPage(perPage) {
                this._perPage = perPage;
            },

            /**
             * @method addExactFilter
             * @param property {String}
             * @param values {Array}
             * @return {void}
             */
            addExactFilter: function addExactFilter(property, values) {
                this.addFilter('makeExactFilter', property, values);
                return false;
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
             * @param sortingMethod {Function}
             * @return {void}
             */
            addSort: function addSort(name, sortingMethod) {

                var SortingAlgorithm = P.Sort.extend({
                    attr: name,
                    fn:   sortingMethod
                });

                this._collection.addSorts([new SortingAlgorithm(name)]);

            },

            /**
             * @method sortBy
             * @param property {String}
             * @param isAscending {Boolean}
             * @return {void}
             */
            sortBy: function sortBy(property, isAscending) {

                if (typeof isAscending === 'undefined' && this._sortBy === property) {

                    // Reverse the sorting if the user clicked on it again.
                    this._sortAscending = !this._sortAscending;

                } else {

                    // Otherwise we'll add the sorting based on the user's preference.
                    this._sortAscending = isAscending;

                }

                this._sortBy = property;

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
             * @property unfilter
             * @return {void}
             */
            unfilter: function unfilter() {

                for (var property in this._collection.filters) {

                    if (this._collection.filters.hasOwnProperty(property)) {

                        this._collection.filters[property].query([]);
                        delete this._filters[property];

                    }

                }
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
     * @filter poCollection
     */
    poApp.filter('poCollection', function poCollection() {

        /**
         * @method poCollectionFilter
         * @param pourOver {ngPourOverCollection}
         * @return {Array}
         */
        return function poCollectionFilter(pourOver) {

            if (pourOver._debug) {
                $console.time('timeMeasure');
            }

            if (typeof pourOver._collection === 'undefined') {

                // Return the item immediately as it may not be initialised yet.
                return pourOver;

            }

            // Load current collection into a PourOver view.
            var view    = new P.View('defaultView', pourOver._collection),
                query   = view['match_set'],
                filters = pourOver._collection.filters;

            // Update the current page number.
            console.log(pourOver._pageNumber);
            view.pageTo(pourOver._pageNumber);

            if (pourOver._perPage) {

                // Define the page size if we're not using infinity.
                view['page_size'] = pourOver._perPage;

            }

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
            view['match_set'] = query;
            var models = view.getCurrentItems();

            if (pourOver._debug) {
                $console.timeEnd('timeMeasure');
            }

            if (!pourOver._sortAscending) {

                // Reverse the order if we're descending.
                models = models.reverse();

            }

            return models;

        };

    });

})(window, window.angular, window.console);