describe('ngPourOver', function() {

    var $pourOver, $filter;

    beforeEach(function() {

        module('ngPourOver');

        inject(function(_PourOver_, _$filter_) {

            var collection = [
                { name: 'Adam',  friends: ['Maria', 'Artem'] },
                { name: 'Maria', friends: ['Adam'] },
                { name: 'Artem', friends: ['Adam'] },
                { name: 'Sarah', friends: ['Adam', 'Maria'] },
                { name: 'Karl',  friends: ['Adam', 'Maria'] }];

            $pourOver = new _PourOver_(collection);
            $pourOver.setPerPage(3);
            $filter   = _$filter_;

        });

    });

    it('Should be able to add an exact filter.', function() {
        expect($pourOver._collection.filters.name).toBeUndefined();
        $pourOver.addExactFilter('name');
        expect($pourOver._collection.filters.name).toBeDefined();
    });

    it('Should be able to add an inclusive filter.', function() {
        expect($pourOver._collection.filters.name).toBeUndefined();
        $pourOver.addInclusionFilter('name');
        expect($pourOver._collection.filters.name).toBeDefined();
    });

    it('Should be able to fetch the unique properties.', function() {
        expect($pourOver._fetchProperties('name').length).toEqual(5);
    });

    it('Should be able to sort by the name property.', function() {

        var collection;

        collection = $filter('poCollection')($pourOver);
        expect(collection.length).toEqual(3);

        expect($pourOver._sortBy).toEqual(null);
        $pourOver.addSort('name', function(a, b) {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });

        $pourOver.sortBy('name');
        expect($pourOver._sortAscending).toEqual(false);
        expect($pourOver._sortBy).not.toEqual(null);

        collection = $filter('poCollection')($pourOver);
        expect(collection.length).toEqual(3);
        expect(collection[0].name).toEqual('Adam');
        expect(collection[1].name).toEqual('Artem');
        expect(collection[2].name).toEqual('Karl');

        $pourOver.unsort();
        collection = $filter('poCollection')($pourOver);
        expect(collection.length).toEqual(3);
        expect(collection[0].name).toEqual('Adam');
        expect(collection[1].name).toEqual('Maria');
        expect(collection[2].name).toEqual('Artem');

        $pourOver.sortBy('name');
        $pourOver.sortBy('name');
        expect($pourOver._sortAscending).toEqual(true);
        collection = $filter('poCollection')($pourOver);
        expect(collection[0].name).toEqual('Karl');

        $pourOver.sortBy('name', false);
        expect($pourOver._sortAscending).toEqual(false);
        collection = $filter('poCollection')($pourOver);
        expect(collection[0].name).toEqual('Adam');

    });

    it('Should be able to exact filter by name property.', function() {

        var collection;

        collection = $filter('poCollection')($pourOver);
        expect(collection.length).toEqual(3);

        expect($pourOver._filters.name).toBeUndefined();
        $pourOver.addExactFilter('name');
        $pourOver.filterBy('name', 'Adam');
        expect($pourOver._filters.name).toBeDefined();

        collection = $filter('poCollection')($pourOver);
        expect(collection.length).toEqual(1);

        $pourOver.unfilterBy('name');
        collection = $filter('poCollection')($pourOver);
        expect(collection.length).toEqual(3);

    });

    it('Should be able to inclusive filter by friends property.', function() {

        var collection;

        collection = $filter('poCollection')($pourOver);
        expect(collection.length).toEqual(3);

        expect($pourOver._filters.friends).toBeUndefined();
        $pourOver.addInclusionFilter('friends');
        $pourOver.filterBy('friends', 'Artem');
        expect($pourOver._filters.friends).toBeDefined();

        collection = $filter('poCollection')($pourOver);
        expect(collection.length).toEqual(1);

        $pourOver.unfilter();
        collection = $filter('poCollection')($pourOver);
        expect(collection.length).toEqual(3);

    });

    it('Should be able to paginate the collection.', function() {

        expect($pourOver._perPage).toEqual(3);
        expect($pourOver._pageNumber).toEqual(1);
        $pourOver.nextPage();
        expect($pourOver._pageNumber).toEqual(2);
        $pourOver.previousPage();
        expect($pourOver._pageNumber).toEqual(1);
        $pourOver.setPageNumber(2);
        expect($pourOver._pageNumber).toEqual(2);

    });

    it('Should be able to define debug mode.', function() {

        expect($pourOver._debug).toBeFalsy();
        $pourOver.setDebug(true);
        expect($pourOver._debug).toBeTruthy();
        $pourOver.setDebug(false);
        expect($pourOver._debug).toBeFalsy();

    });

    it ('Should be able to cache the collection.', function() {

        $pourOver.addExactFilter('name');
        $pourOver.filterBy('name', 'Adam');
        expect($pourOver._filters.name).toBeDefined();

        expect($pourOver._collectionCache.length).toEqual(0);
        var collection = $filter('poCollection')($pourOver);
        expect(collection.length).toEqual(1);
        expect(collection[0].name).toEqual($pourOver._collectionCache[0].name);

    });

    it ('Should be able to manage the iterations.', function() {

        expect($pourOver._lastIteration).toEqual(0);
        expect($pourOver._currentIteration).toEqual(1);
        $pourOver.addExactFilter('name');
        $pourOver.filterBy('name', 'Adam');
        expect($pourOver._lastIteration).toEqual(0);
        expect($pourOver._currentIteration).toEqual(2);
        $filter('poCollection')($pourOver);
        expect($pourOver._lastIteration).toEqual(2);

    });

    it ('Should be able to add a filter with a different name to its attribute', function() {

        expect($pourOver._lastIteration).toEqual(0);
        expect($pourOver._currentIteration).toEqual(1);
        $pourOver.addExactFilter('notName', false, {attr: 'name'});
        $pourOver.filterBy('notName', 'Adam');
        expect($pourOver._lastIteration).toEqual(0);
        expect($pourOver._currentIteration).toEqual(2);
        $filter('poCollection')($pourOver);
        expect($pourOver._lastIteration).toEqual(2);

    });

    it ('Should be able to filter twice over the same attribute using two different filter names', function() {

        expect($pourOver._lastIteration).toEqual(0);
        expect($pourOver._currentIteration).toEqual(1);

        $pourOver.addExactFilter('notName', false, {attr: 'name'});
        $pourOver.addExactFilter('notNameTwo', false, {attr: 'name'});

        $pourOver.filterBy('notName', 'Adam');
        expect($pourOver._currentIteration).toEqual(2);
        var collection = $filter('poCollection')($pourOver);
        expect(collection.length).toEqual(1);
        expect($pourOver._lastIteration).toEqual(2);

        $pourOver.filterBy('notNameTwo', 'Maria', 'or');
        expect($pourOver._lastIteration).toEqual(2);
        collection = $filter('poCollection')($pourOver);
        expect(collection.length).toEqual(2);
        expect($pourOver._lastIteration).toEqual(3);
        expect($pourOver._currentIteration).toEqual(3);

    });

});