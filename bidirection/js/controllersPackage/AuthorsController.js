
/* Author Controller */


/*==================================================================================================
 *==================================================================================================
 * # AuthorsController
 * - for showAllAuthors, addAuthor, updateAuthor and destroyAuthor.
 *
 * @param  {Object} $scope      [glue between view/model and controller]
 * @param  {Object} $location   [control the url]
 * @param  {Object} $http       [get connection with parse.com using REST Api]
 **************************************************************************************************/
publicLibraryControllers.controller('AuthorsController', ['$scope', '$location', '$http',
  function ( $scope, $location, $http) {

    /**
     * ## loadingProgress
     * - once the page is loaded, only show progressbar, which will be hidden after all data are
     *   loaded, then the rest content of this page will be shown.
     */
    $scope.loadingProgress = true;

    /**
     * ## $http: Get all authors
     * - sent a GET request to parse.com once the controller is loaded. If the request is succeed,
     *   all authors stored in parse.com will be loaded and saved to an array $scope.authors;
     *   otherwise, show error messages in console.
     * - When the request is succeed, get all corresponding books and store them to authoredBooks.
     * - Another job after the request is to format all data in type of string to real data type,
     *   cause in parse.com the date type will be stored as the type of string.
     *
     * @type {Object}
     */
    $scope.getAllAuthors = function () {
      $http( {
        method: 'GET',
        url: 'https://api.parse.com/1/classes/Author'
      })
        .success( function ( data) {
          $scope.authors = data.results;
          // format string date to real date
          $scope.authors.forEach( function( a) {
            a.birthDate = new Date( a.birthDate);
            if ( a.deathDate) {
              a.deathDate = new Date( a.deathDate);
            }
          });
          // Get the authored books
          var counter = $scope.authors.length;
          $scope.authors.forEach( function ( a) {
            $http( {
              method: 'GET',
              url: 'https://api.parse.com/1/classes/Book',
              params: {
                where: {
                  authors: {
                    __type: 'Pointer',
                    className: 'Author',
                    objectId: a.objectId
                  }
                }
              }
            })
              .success( function ( data) {
                a.authoredBooks = angular.copy( data.results);
                // after loaded all data, hide progressbar and show content.
                counter--;
                if ( counter == 0) {
                  $scope.loadingProgress = false;
                }
              })
              .error( function ( data) { console.log("Error for getting related books", data);});
          });
        })
        .error( function ( data) {
          console.log( data);
          alert("OH! Can NOT get all authors. See the information in console.");
        });
    };

    /**
     * ## addAuthor
     * - send a POST request to parse.com for inserting a new author record which stored in
     *   $scope.author to parse.com.
     * - If the request is succeed, clear all the temporary data and jump to parent page;
     * - otherwise, show error messages in console.
     */
    $scope.addAuthor = function () {
      if ( $scope.authorInfo.$valid) {
        $http( {
          method: 'POST',
          url: 'https://api.parse.com/1/classes/Author',
          data: {
            authorId: $scope.author.authorId,
            name: $scope.author.name,
            birthDate: $scope.author.birthDate,
            deathDate: $scope.author.deathDate
          }
        })
          .success( function () { $location.path('/authors/manageAuthors');})
          .error( function ( data) {
            console.log( data);
            alert("OH! Author is NOT added. See the information in console.");
          });
      } else {
        console.log("Form is invalid!");
      }
    };

    /**
     * ## selectAuthor
     * - When an author is selected, back this object up to the tempAuthor and show form.
     */
    var tempAuthor = {
      authorId: 0,
      name: "",
      birthDate: undefined,
      deathDate: undefined
    };
    $scope.selectAuthor = function () {
      $scope.isSelected = true;
      tempAuthor = angular.copy( $scope.author);
      // watcher whether the author has been changed or not
      $scope.$watchCollection( 'author', function ( newAuthor) {
        if ( angular.equals( newAuthor, tempAuthor)) {
          $scope.authorInfo.$setPristine();
        }
      });
    };

    /**
     * ## updateAuthor
     * - send a PUT request to parse.com for changing author record, which has a standard objectId
     *   defined by parse.com itself and stored in $scope.book, to parse.com.
     * - If the request is succeed, clear all the temporary data and jump to parent page;
     * - otherwise, show error messages in console.
     * - after updated the name of one author, update the corresponding book's authors list.
     */
    $scope.updateAuthor = function () {
      if ( $scope.authorInfo.$valid && (angular.equals( $scope.author, tempAuthor) == false))  {
        $http( {
          method: 'PUT',
          url: 'https://api.parse.com/1/classes/Author/' + $scope.author.objectId,
          data: {
            name: $scope.author.name,
            birthDate: $scope.author.birthDate,
            deathDate: $scope.author.deathDate
          }
        })
          .success( function () { $location.path('/authors/manageAuthors');})
          .error( function ( data) {
            console.log( data);
            alert("OH! Author is NOT updated. See the information in console.");
          });
      } else {
        console.log("Form is invalid or you didn't change the information!");
      }
    };

    /**
     * ## destroyAuthor
     * - send a DELETE request to parse.com for deleting a author record which has a standard
     *   objectId defined by parse.com itself.
     * - If the request is succeed, jump to parent page;
     * - otherwise, show error messages in console.
     * - after deleted an author, delete this name from the corresponding book's authors list.
     */
    $scope.destroyAuthor = function () {
      $http( {
        method: 'DELETE',
        url: 'https://api.parse.com/1/classes/Author/' + $scope.author.objectId
      })
        .success( function () { $location.path('/authors/manageAuthors');})
        .error( function ( data) {
          console.log( data);
          alert("OH! Author is NOT deleted. See the information in console.");
        });
    };
  }]);
