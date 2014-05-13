ngPourOver
==========

<img src="https://travis-ci.org/Wildhoney/ngPourOver.png?branch=master" alt="Travis CI" />
&nbsp;
<img src="https://badge.fury.io/js/ng-pourover.png" alt="NPM Version" />

Installation Steps
----------

 * `bower install ng-pourover`;
 * `cd ng-pourover`;
 * `npm install`;
 * `bower install`;
 * `node example/server.js`;
 * Browse to [http://localhost:3001/](http://localhost:3001/);


Getting Started
----------

NYTimes' [PourOver](http://nytimes.github.io/pourover/) module allows for quick filtering and sorting.

In the `example` we are filtering within ~10 milliseconds a 100,000 collection.

Getting started with `ngPourOver` is fairly straightforward &ndash; you first need to add the dependency `PourOver` into your controller.

```javascript
$myApp.controller('myController', ['PourOver', function(PourOver) {

}]);
```

You then have everything you need to initialise your collection &ndash; assuming your collection is currently stored in the `collection` variable.

```javascript
$scope.collection = new PourOver(collection);
```

If you attempt the aforementioned without adding the `poCollection` filter &ndash; the work-horse of the `ngPourOver` module, then things won't be pretty. Ensure you've added the `poCollection` to your template.

```html
<li ng-repeat="model in collection | poCollection">
```

Logically the next step is to define your first filter on a property &ndash; let's say you have a property called `name` defined in your collection.

```javascript
$scope.collection.addExactFilter('word');
```

Afterwards you're able to begin filtering on this property.

```javascript
$scope.collection.filterBy('word', 'Supercalifragilisticexpialidocious');
```

You're even able to unfilter all with the `unfilter` method, and unfilter a specific filter with `unfilterBy`.

Unit Tests
----------

All of `ngPourOver`'s unit tests are written in [Jasmine](http://jasmine.github.io/) and can be run with `grunt test` after you have followed the [installation steps](#installation-steps) above.

Please open a pull request for all commits, and ensure all tests are passing before opening your PR.

**Every developer's dream:**

<img src="http://i.imgur.com/5eZT87c.png" />