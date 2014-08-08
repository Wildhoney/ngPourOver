(function ngPourOver($window, _, $angular, $console) {

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
             * @constant TIMING_NAME
             * @type {String}
             * @default "timeMeasure"
             */
            TIMING_NAME: 'timeMeasure',

            /**
             * @property _collection
             * @type {Array}
             * @private
             */
            _collection: [],

            /**
             * @property _collectionCache
             * @type {Array}
             * @private
             */
            _collectionCache: [],

            /**
             * @property filters
             * @type {Array}
             * @private
             */
            _filters: [],

            /**
             * @property _currentIteration
             * @type {Number}
             * @default 0
             */
            _currentIteration: 0,

            /**
             * @property _lastIteration
             * @type {Number}
             * @default 0
             */
            _lastIteration: 0,

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
                this._currentIteration++;
                this._pageNumber = pageNumber;
            },

            /**
             * @method previousPage
             * @return {void}
             */
            previousPage: function previousPage() {
                this._currentIteration++;
                this._pageNumber -= 1;
            },

            /**
             * @method nextPage
             * @return {void}
             */
            nextPage: function nextPage() {
                this._currentIteration++;
                this._pageNumber += 1;
            },

            /**
             * @method setPerPage
             * @param perPage {Number}
             * @return {void}
             */
            setPerPage: function setPerPage(perPage) {
                this._currentIteration++;
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

                this._currentIteration++;

                if (typeof isAscending === 'undefined' && this._sortBy === property) {

                    // Reverse the sorting if the user clicked on it again.
                    this._sortAscending = !this._sortAscending;

                } else {

                    // Otherwise we'll add the sorting based on the user's preference.
                    this._sortAscending = !!isAscending;

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
                this._currentIteration++;
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

                this._currentIteration++;

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

                this._filters[property] = { property: type, value: value, type: type };

            },

            /**
             * @property unfilterBy
             * @param property {String}
             * @return {void}
             */
            unfilterBy: function unfilterBy(property) {
                this._currentIteration++;
                delete this._filters[property];
            },

            /**
             * @property unfilter
             * @return {void}
             */
            unfilter: function unfilter() {

                this._currentIteration++;

                for (var property in this._collection.filters) {

                    if (this._collection.filters.hasOwnProperty(property)) {
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
                $console.time(this.TIMING_NAME);
            }

            if (typeof pourOver._collection === 'undefined') {

                // Return the item immediately as it may not be initialised yet.
                return pourOver;

            }

            // Determine if we can just return the cached collection.
            if (pourOver._lastIteration === pourOver._currentIteration) {

                if (pourOver._debug) {
                    $console.timeEnd(this.TIMING_NAME);
                }

                return pourOver._collectionCache;

            }

            // Update the iteration version.
            pourOver._lastIteration = pourOver._currentIteration;

            // Load current collection into a PourOver view.
            /*jshint camelcase: false */
            var view    = new P.View('defaultView', pourOver._collection, { page_size: pourOver._perPage }),
                query   = view['match_set'];

            // Update the current page number.
            view.page(pourOver._pageNumber - 1);

            if (pourOver._sortBy) {

                // Define the sort by algorithm.
                view.setSort(pourOver._sortBy);

            }

            // Iterate over each defined filter.
            for (var property in pourOver._filters) {

                if (pourOver._filters.hasOwnProperty(property)) {

                    var filter = pourOver._collection.filters[property],
                        model  = pourOver._filters[property];

                    // Perform the query on the collection.
                    filter.query(model.value);

                    // Concatenate with the other executed queries.
                    query = query[model.type](filter['current_query']);

                }

            }

            // Update the match set with our defined query, and then return the collection.
            view['match_set'] = query;

            pourOver._totalViewItems = query.cids.length;
            pourOver._collectionCache = view.getCurrentItems();

            if (pourOver._debug) {
                $console.timeEnd(this.TIMING_NAME);
            }

            if (pourOver._sortAscending) {

                // Reverse the order if we're descending.
                pourOver._collectionCache = pourOver._collectionCache.reverse();

            }

            return pourOver._collectionCache;

        };

    });

})(window, window._, window.angular, window.console);