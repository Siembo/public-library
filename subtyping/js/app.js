
/* App Module */

var publicLibraryApp = angular.module(
  'publicLibraryApp',
  [
    // inject Angular modules
    'ngRoute',
    'ngMessages',
    // inject user-defined modules
    'publicLibraryControllers',
    'publicLibraryDirectives',
    'publicLibraryServices'
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
    // Employees Manager
    .when('/employees/manageEmployees', {
      templateUrl: 'partials/employees/manageEmployees.html'
    })
    .when('/employees/showAllEmployees', {
      templateUrl: 'partials/employees/showAllEmployees.html',
      controller: 'EmployeesController'
    })
    .when('/employees/createEmployee', {
      templateUrl: 'partials/employees/createEmployee.html',
      controller: 'EmployeesController'
    })
    .when('/employees/updateEmployee', {
      templateUrl: 'partials/employees/updateEmployee.html',
      controller: 'EmployeesController'
    })
    .when('/employees/deleteEmployee', {
      templateUrl: 'partials/employees/deleteEmployee.html',
      controller: 'EmployeesController'
    })
    // Default to Main page
    .otherwise({
      redirectTo: '/main'
  });
}])
// Predefine the API value from Parse.com
.run(['$http', function($http) {
  $http.defaults.headers.common = {
    'X-Parse-Application-Id': '9ZMqIrAjv7Ct5GELcLdeaGXmj6JhvenSBPvXEgr9',
    'X-Parse-REST-API-Key': 'gtzprjU0NnfLGPRLktnG9KmynnX1qOBlpxfnoNEl'
  }
}])
// Get the value of current year, which will be used for whole project
.run(['$rootScope', function($rootScope) {
  $rootScope.currentYear = new Date().getFullYear();
}]);
