
/* App Module */

var publicLibraryApp = angular.module(
  'publicLibraryApp',
  [
    // injected Angular modules
    'ngRoute',
    'ngMessages',
    'publicLibraryControllers',
    'publicLibraryDirectives'
  ]
);


/**
 * App Configuration
 */
publicLibraryApp
.config(['$routeProvider', function($routeProvider){
  // Router's configurations
  $routeProvider
    // Main page for all views
    .when('/main', {
      templateUrl: 'partials/main.html',
      controller: 'TestDatasController'
     })
    // Books Manager
    .when('/books/manageBooks', {
      templateUrl: 'partials/books/manageBooks.html'
    })
    .when('/books/showAllBooks', {
      templateUrl: 'partials/books/showAllBooks.html',
      controller: 'BooksController'
    })
    .when('/books/createBook', {
      templateUrl: 'partials/books/createBook.html',
      controller: 'BooksController'
    })
    .when('/books/updateBook', {
      templateUrl: 'partials/books/updateBook.html',
      controller: 'BooksController'
    })
    .when('/books/deleteBook', {
      templateUrl: 'partials/books/deleteBook.html',
      controller: 'BooksController'
    })
    // Publishers Manager
    .when('/publishers/managePublishers', {
      templateUrl: 'partials/publishers/managePublishers.html'
    })
    .when('/publishers/showAllPublishers', {
      templateUrl: 'partials/publishers/showAllPublishers.html',
      controller: 'PublishersController'
    })
    .when('/publishers/createPublisher', {
      templateUrl: 'partials/publishers/createPublisher.html',
      controller: 'PublishersController'
    })
    .when('/publishers/updatePublisher', {
      templateUrl: 'partials/publishers/updatePublisher.html',
      controller: 'PublishersController'
    })
    .when('/publishers/deletePublisher', {
      templateUrl: 'partials/publishers/deletePublisher.html',
      controller: 'PublishersController'
    })
    // Authors Manager
    .when('/authors/manageAuthors', {
      templateUrl: 'partials/authors/manageAuthors.html'
    })
    .when('/authors/showAllAuthors', {
      templateUrl: 'partials/authors/showAllAuthors.html',
      controller: 'AuthorsController'
    })
    .when('/authors/createAuthor', {
      templateUrl: 'partials/authors/createAuthor.html',
      controller: 'AuthorsController'
    })
    .when('/authors/updateAuthor', {
      templateUrl: 'partials/authors/updateAuthor.html',
      controller: 'AuthorsController'
    })
    .when('/authors/deleteAuthor', {
      templateUrl: 'partials/authors/deleteAuthor.html',
      controller: 'AuthorsController'
    })
    // Default to Main page
    .otherwise({
      redirectTo: '/main'
  });
}])
// Predefine the API value from Parse.com
.run(['$http', function($http) {
  $http.defaults.headers.common = {
    'X-Parse-Application-Id': 'KzllJrzKJvtbiQmbw40jmJk7YuKQPQbOHq78KCTT',
    'X-Parse-REST-API-Key': 'ti1GKI7iPaFa0GFyvrUoRO9X5Ahai5HrdSFWpEKG'
  }
}])
// Get the value of current year, which will be used for whole project
.run(['$rootScope', function($rootScope) {
  $rootScope.currentYear = new Date().getFullYear();
}]);
