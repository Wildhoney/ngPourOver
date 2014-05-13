describe('ngPourOver', function() {

    beforeEach(module('ngPourOver'));

    describe('Filtering', function() {

        var $pourOver, $filter;

        beforeEach(function() {

            inject(function(_PourOver_, _$filter_) {

                var collection = [
                    { name: 'Adam',  friends: ['Maria', 'Artem'] },
                    { name: 'Maria', friends: ['Adam'] },
                    { name: 'Artem', friends: ['Adam'] }];

                $pourOver      = new _PourOver_(collection);
                $filter        = _$filter_;

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
            expect($pourOver._fetchProperties('name').length).toEqual(3);
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

        });

        it('Should be able to inclusive filter by friends property.', function() {

            var collection;

            collection = $filter('poCollection')($pourOver);
            expect(collection.length).toEqual(3);

            expect($pourOver._filters.friends).toBeUndefined();
            $pourOver.addInclusionFilter('friends');
            $pourOver.filterBy('friends', 'Adam');
            expect($pourOver._filters.friends).toBeDefined();

            collection = $filter('poCollection')($pourOver);
            expect(collection.length).toEqual(2);

        });

    });

});