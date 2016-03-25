
/* App Module */

var publicLibraryApp = angular.module(
  'publicLibraryApp',
  [
    'ngRoute',
    'ngMessages',
    'publicLibraryControllers',
    'publicLibraryDirectives'
  ]
);


/* App Configuration */
publicLibraryApp
.config( [ '$routeProvider', function ( $routeProvider) {
  $routeProvider
    .when( '/main', {
      templateUrl: 'partials/main.html',
      controller: 'TestDatasController'
     })
    .when( '/showAllBooks', {
      templateUrl: 'partials/showAllBooks.html',
      controller: 'BooksController'
    })
    .when( '/createBook', {
      templateUrl: 'partials/createBook.html',
      controller: 'BooksController'
    })
    .when( '/updateBook', {
      templateUrl: 'partials/updateBook.html',
      controller: 'BooksController'
    })
    .when( '/deleteBook', {
      templateUrl: 'partials/deleteBook.html',
      controller: 'BooksController'
    })
    .otherwise( {
      redirectTo: '/main'
  });
}])
.run( [ '$http', function ( $http) {
  // Predefine the API value from Parse.com
  $http.defaults.headers.common = {
    'X-Parse-Application-Id': 'WhtFJpZZX65DpLj2aozjwYH9dsH0BYeNPzsMNdsC',
    'X-Parse-REST-API-Key': 'LN63x56yilYfdc9WQa7ew9QqBJclMxEyqYB0a892'
  }
}])
.run( [ '$rootScope', function ( $rootScope) {
  $rootScope.currentYear = new Date().getFullYear();
}]);
