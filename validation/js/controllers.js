
/* Controllers */

var publicLibraryControllers = angular.module('publicLibraryControllers', []);

/***************************************************************************************************
 ***************************************************************************************************
 * # BooksController:
 * - for showAllBooks, addBook, updateBook and destroyBook.
 *
 * @param  {Object} $scope      [glue between view/model and controller]
 * @param  {Object} $location   [control the url]
 * @param  {Object} $http       [get connection with parse.com using REST Api]
 **************************************************************************************************/
publicLibraryControllers.controller( 'BooksController', ['$scope', '$location', '$http',
  function ( $scope, $location, $http) {

    /**
     * ## loadingProgress
     * - once the page is loaded, only show progressbar, which will be hidden after got all data,
     *   and the rest content of this page will be shown;
     */
    $scope.showLoading = true;

    /**
     * ## getAllBooks
     * - sent a GET request to parse.com once the controller is loaded. If the request is succeed,
     *   all books stored in parse.com will be loaded and saved to an array $scope.books; otherwise,
     *   show error messages in console.
     */
    $scope.getAllBooks = function () {
      $http({
        method: 'GET',
        url: 'https://api.parse.com/1/classes/Book'
      })
        .success( function ( data) {
          $scope.books = data.results;
          $scope.showLoading = false;
        })
        .error( function ( data) {
          console.log( data);
          alert("OH! Can NOT get all books, see the information in console.");
        });
    };

    /**
     * ## addBook
     * - send a POST request to parse.com for inserting a new book record which stored in
     *   $scope.book to parse.com. If the request is succeed, clear all the temporary data and jump
     *   to parent page; otherwise, show error messages in console.
     */
    $scope.addBook = function () {
      if ( $scope.bookInfo.$valid) {
        $http({
          method: 'POST',
          url: 'https://api.parse.com/1/classes/Book',
          data: {
            isbn: $scope.book.isbn,
            title: $scope.book.title,
            year: $scope.book.year,
            edition: $scope.book.edition
          }
        })
          .success( function () { $location.path('/');})
          .error( function ( data) {
            console.log( data);
            alert("OH! Book is NOT added, see the information in console.");
          });
      } else {
        console.log("Form is invalid!");
      }
    };

    /**
     * ## tempBook
     * - for updating book, check whether the book is changed.
     */
    var tempBook = {
      isbn: "",
      title: "",
      year: 0,
      edition: 0
    };

    /**
     * ## selectBook
     * - When an Book is selected, show form.
     */
    $scope.selectBook = function () {
      $scope.isSelected = true;
      tempBook = angular.copy( $scope.book);
      // watcher whether the book has been changed or not
      $scope.$watchCollection( 'book', function ( newBook) {
        if ( angular.equals( newBook, tempBook)) {
          $scope.bookInfo.$setPristine();
        }
      });
    };

    /**
     * ## updateBook
     * - send a PUT request to parse.com for changing book record, which has a standard objectId
     *   defined by parse.com itself and stored in $scope.book, to parse.com. If the request is
     *   succeed, clear all the temporary data and jump to parent page; otherwise, show error
     *   messages in console.
     */
    $scope.updateBook = function () {
      if ( $scope.bookInfo.$valid && ( angular.equals( $scope.book, tempBook) == false)) {
        var bookUrl = 'https://api.parse.com/1/classes/Book/' + $scope.book.objectId;
        $http({
          method: 'PUT',
          url: bookUrl,
          data: {
            isbn: $scope.book.isbn,
            title: $scope.book.title,
            year: $scope.book.year,
            edition: $scope.book.edition
          }
        })
          .success( function () { $location.path('/');})
          .error( function ( data) {
            console.log( data);
            alert("OH! Book is NOT updated, see the information in console.");
          });
      } else {
        console.log("Form is invalid or you didn't change the information!");
      }
    };

    /**
     * ## destroyBook
     * - send a DELETE request to parse.com for deleting a book record which has a standard objectId
     *   defined by parse.com itself. If the request is succeed, jump to parent page; otherwise,
     *   show error messages in console.
     */
    $scope.destroyBook = function () {
      var bookUrl = 'https://api.parse.com/1/classes/Book/' + $scope.book.objectId;
      $http({
        method: 'DELETE',
        url: bookUrl
      })
        .success( function () { $location.path('/');})
        .error( function ( data) {
          console.log( data);
          alert("Book is NOT deleted. Something goes wrong... see the information in console.");
        });
    };
  }]);



/*==================================================================================================
 *==================================================================================================
 * # TestDatasController
 * - for creating and clearing test data.
 **************************************************************************************************/
publicLibraryControllers.controller( 'TestDatasController', ['$scope', '$http', '$timeout',
  function (  $scope, $http, $timeout) {
    // Create test data.
    $scope.createTestData = function () {
      $scope.clearDatabase();
      $timeout( function () {
        // basic data from author, publisher and book
        $http( {
          method: 'POST',
          url: 'https://api.parse.com/1/batch',
          data: {
            requests: [
              // Create Test Data for Books
              {
                method: 'POST',
                path: '/1/classes/Book',
                body: {
                  isbn: "0553345842",
                  title: "The Mind's I",
                  year: 1982
                }
              },
              {
                method: 'POST',
                path: '/1/classes/Book',
                body: {
                  isbn: "1463794762",
                  title: "The Critique of Pure Reason",
                  year: 2011
                }
              },
              {
                method: 'POST',
                path: '/1/classes/Book',
                body: {
                  isbn: "1928565379",
                  title: "The Critique of Practical Reason",
                  year: 2009
                }
              },
              {
                method: 'POST',
                path: '/1/classes/Book',
                body: {
                  isbn: "0465030793",
                  title: "I Am A Strange Loop",
                  year: 2000
                }
              }
            ]
          }
        })
          .success( function () {
            console.log("added 4 books");
          })
          .error( function ( data) {
            console.log(data);
            alert("OH! Something goes wrong. See the information in console.");
          });
      }, 2000);
    };

    // Clear all test data.
    $scope.clearDatabase = function () {
      // Clear all Book Data
      $http( {
        method: 'GET',
        url: 'https://api.parse.com/1/classes/Book'
      })
        .success( function ( data) {
          var obs = data.results;
          obs.forEach( function ( ob) {
            $http( {
              method: 'DELETE',
              url: 'https://api.parse.com/1/classes/Book/' + ob.objectId
            })
              .error( function ( data) {
                console.log( data);
                alert("OH! Something goes wrong. See the information in console.");
              });
          });
          console.log("cleared all book data.");
        })
        .error( function ( data) {
          console.log( data);
          alert("OH! Something goes wrong. See the information in console.");
        });
    };
  }]);
