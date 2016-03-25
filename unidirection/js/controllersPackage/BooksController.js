
/* Book Controller */


/*==================================================================================================
 *==================================================================================================
 * # BooksController:
 * - for showAllBooks, addBook, updateBook and destroyBook.
 *
 * @param  {Object} $scope      [glue between view/model and controller]
 * @param  {Object} $location   [control the url]
 * @param  {Object} $http       [get connection with parse.com using REST Api]
 **************************************************************************************************/
publicLibraryControllers.controller('BooksController', ['$scope', '$location', '$http', '$timeout',
  function ( $scope, $location, $http, $timeout){

    /**
     * ## loadingProgress
     * - once the page is loaded, only show progressbar, which will be hidden after all books are
     *   loaded, then the rest content of this page will be shown;
     */
    $scope.loadingProgress = true;

    /**
     * ## $http: Get all books
     * - Get all book records from Parse.com. If the request is succeed, all books will be
     *   stored to an array $scope.books; otherwise, show error messages in console.
     */
    $scope.getAllBooks = function () {
      $http({
        method: 'GET',
        url: 'https://api.parse.com/1/classes/Book',
        params: { include: 'publisher'}
      })
        .success( function ( data) {
          $scope.books = data.results;
          // Get corresponding publisher and authors
          var counter = $scope.books.length;
          $scope.books.forEach( function ( b) {
            // Get corresponding author object for each book using Parse Relation
            if ( b.authors) {
              $http( {
                method: 'GET',
                url: 'https://api.parse.com/1/classes/Author',
                params: {
                  where: {
                    $relatedTo: {
                      object: {
                        __type: 'Pointer',
                        className: 'Book',
                        objectId: b.objectId
                      },
                      key: 'authors'
                    }
                  }
                }
              })
                .success( function ( data) { b.authors = angular.copy( data.results);})
                .error( function ( data) {console.log(data);});
            }
            // hide progressbar and show rest content.
            counter--;
            if ( counter == 0) {
              $timeout( function () { $scope.loadingProgress = false;}, 1500);
            }
          });
        })
        .error( function ( data) {
          console.log( data);
          alert("OH! Can NOT get all books. See the information in console.");
        });
    };

    /**
     * ## tempBook
     * - Used for creating and updating a book
     * - When Creating: assign this empty book object to $scope.book
     * - When Updating: back up the selected book for checking whether the book is changed or not.
     */
    var tempBook = {
      isbn: "",
      title: "",
      year: 0,
      publisher: null,  // mono selection; type: Object (Pointer)
      authors: []  // multi selections; type: Object (Parse Relation)
    };

    /**
     * ## prepareBook
     * - Used for creating or updating a book
     * - When Creating: create a empty book object and get publishers and authors objects
     * - When Updating: back up the selected book and get publishers and authors objects
     */
    $scope.prepareBook = function () {
      if ( $scope.book) {
        $scope.isSelected = true;
        tempBook = angular.copy( $scope.book);
        // watcher whether the book has been changed or not
        $scope.$watchCollection( 'book', function (newBook) {
          if ( angular.equals( newBook, tempBook)) { $scope.bookInfo.$setPristine();}
        });
      } else {
        $scope.book = angular.copy( tempBook);
      }
      // get all publishers and authors
      $scope.publisherOptions = [];
      $scope.authorOptions = [];
      // get publishers
      $http( {
        method: 'GET',
        url: 'https://api.parse.com/1/classes/Publisher'
      })
        .success( function ( data) {
          $scope.publisherOptions =  data.results;
          if ( $scope.book.publisher) {
            // if has a publisher, set default to select this publisher
            var idx = 0;
            while ( $scope.publisherOptions[idx].objectId != $scope.book.publisher.objectId) {
              idx++;
            }
            $scope.book.publisher = $scope.publisherOptions[idx];
          }
        })
        .error( function ( data) { console.log( data);});
      // get authors
      $http( {
        method: 'GET',
        url: 'https://api.parse.com/1/classes/Author'
      })
        .success( function ( data) {
          $scope.authorOptions = data.results;
          if ( $scope.book.authors.length > 0) {
            $scope.book.authors.forEach( function ( a) {
              // if has authors, delete these authors from authorOptions list
              $scope.authorOptions.forEach( function ( ao) {
                if ( ao.authorId === a.authorId)
                  $scope.authorOptions.splice( $scope.authorOptions.indexOf( ao), 1);
              });
            });
          }
        })
        .error( function ( data) { console.log( data);});
    };

    /**
     * ## addBook
     * - send a POST request to parse.com for inserting a new book record which stored in
     *   $scope.book to parse.com.
     * - If the request is succeed, clear all the temporary data and jump to parent page;
     * - otherwise, show error messages in console.
     */
    $scope.addBook = function() {
      if ( $scope.bookInfo.$valid) {
        $http( {
          method: 'POST',
          url: 'https://api.parse.com/1/classes/Book',
          data: {
            isbn: $scope.book.isbn,
            title: $scope.book.title,
            year: $scope.book.year
          }
        })
          .success( function ( data) {
            var bookObjectId = data.objectId;
            // if book.publisher is defined, add pointer to this publisher
            if ( $scope.book.publisher) {
              $http( {
                method: 'PUT',
                url: 'https://api.parse.com/1/classes/Book/' + bookObjectId,
                data: {
                  publisher: {
                    __type: 'Pointer',
                    className: 'Publisher',
                    objectId: $scope.book.publisher.objectId
                  }
                }
              })
                .error( function ( data) { console.log( data);});
            }
            // if book.authors is defined, add Parse Relation to these authors
            if ( $scope.book.authors.length > 0) {
              $scope.book.authors.forEach( function ( a) {
                // add relation from book to author
                $http( {
                  method: 'PUT',
                  url: 'https://api.parse.com/1/classes/Book/' + bookObjectId,
                  data: {
                    authors: {
                      __op: 'AddRelation',
                      objects: [{
                        __type: 'Pointer',
                        className: 'Author',
                        objectId: a.objectId
                      }]
                    }
                  }
                })
                  .error( function ( data) { console.log( data);});
              });
            }
            $location.path('/books/manageBooks');
          })
          .error( function ( data) {
            console.log( data);
            alert("OH! Book is NOT added. See the information in console.");
          });
      } else {
        console.log("Form is invalid!");
      }
    };

    /**
     * ## updateBook
     * - send a PUT request to parse.com for changing book record, which has a standard objectId
     *   defined by parse.com itself and stored in $scope.book, to parse.com.
     * - If the request is succeed, clear all the temporary data and jump to parent page;
     * - otherwise, show error messages in console.
     */
    $scope.updateBook = function () {
      if ( $scope.bookInfo.$valid && (angular.equals( $scope.book, tempBook) == false)) {
        $http( {
          method: 'PUT',
          url: 'https://api.parse.com/1/classes/Book/' + $scope.book.objectId,
          data: {
            title: $scope.book.title,
            year: $scope.book.year
          }
        })
          .success( function () {
            // if the publisher of this book has been changed, update the Pointer
            if ( angular.equals( $scope.book.publisher, tempBook.publisher) == false) {
              if ( $scope.book.publisher == null) {
                $http( {
                  method: 'PUT',
                  url: 'https://api.parse.com/1/classes/Book/' + $scope.book.objectId,
                  data: { publisher: { __op: 'Delete'}}
                })
                  .error( function ( data) { console.log( data);});
              } else {
                $http( {
                  method: 'PUT',
                  url: 'https://api.parse.com/1/classes/Book/' + $scope.book.objectId,
                  data: {
                    publisher: {
                      __type: 'Pointer',
                      className: 'Publisher',
                      objectId: $scope.book.publisher.objectId
                    }
                  }
                })
                  .error( function ( data) { console.log( data);});
              }
            }
            // if the authors of this book has been changed, update the Parse Relation
            if ( angular.equals( $scope.book.authors, tempBook.authors) == false) {
              // if old authors of this book is not empty, remove all Parse Relations
              if ( tempBook.authors.length > 0) {
                tempBook.authors.forEach( function ( a) {
                  // remove old related authors relationships from this book
                  $http({
                    method: 'PUT',
                    url: 'https://api.parse.com/1/classes/Book/' + tempBook.objectId,
                    data: {
                      authors: {
                        __op: 'RemoveRelation',
                        objects: [{
                          __type: 'Pointer',
                          className: 'Author',
                          objectId: a.objectId
                        }]
                      }
                    }
                  })
                    .error( function ( data) { console.log( data);});
                });
              }
              // if updated authors of this book is not empty, then add Parse relations
              $timeout( function () {
                if ( $scope.book.authors.length > 0) {
                  $scope.book.authors.forEach( function ( a) {
                    // add new related authors relationships to this book
                    $http({
                      method: 'PUT',
                      url: 'https://api.parse.com/1/classes/Book/' + $scope.book.objectId,
                      data: {
                        authors: {
                          __op: 'AddRelation',
                          objects: [{
                            __type: 'Pointer',
                            className: 'Author',
                            objectId: a.objectId
                          }]
                        }
                      }
                    })
                      .error( function ( data) { console.log( data);});
                  });
                }
              }, 100);
            }
            $location.path('/books/manageBooks');
          })
          .error( function ( data) {
            console.log( data);
            alert("OH! Book is NOT updated. See the information in console.");
          });
      } else {
        console.log("Form is invalid or you didn't change the information!");
      }
    };

    /**
     * ## destroyBook
     * - send a DELETE request to parse.com for deleting a book record which has a standard
     *   objectId defined by parse.com itself.
     * - If the request is succeed, jump to parent page;
     * - otherwise, show error messages in console.
     */
    $scope.destroyBook = function () {
      $http( {
        method: 'DELETE',
        url: 'https://api.parse.com/1/classes/Book/' + $scope.book.objectId
      })
        .success( function () { $location.path('/books/manageBooks');})
        .error( function( data) {
          console.log( data);
          alert("OH! Book is NOT deleted. See the information in console.");
        });
    };

    /**
     * ## addOption
     * - for multi selection, insert selected option in an array $scope.book.authors.
     * - At the same time remove this option from select option list.
     */
    $scope.addAuthorOption = function () {
      if ( $scope.authorOption) {
        $scope.book.authors.push( $scope.authorOption);
        $scope.authorOptions.splice( $scope.authorOptions.indexOf( $scope.authorOption), 1);
        $scope.authorOption = null;
      } else {
        console.log("please choose a author.");
      }
    };

    /**
     * ## removeOption
     *  - for multi selection, insert this option to select option list.
     *  - At the same time, remove one selected option in the array $scope.book.authors.
     *
     * @param {string} author
     */
    $scope.removeAuthorOption = function( author) {
      $scope.authorOptions.push( author);
      $scope.book.authors.splice( $scope.book.authors.indexOf( author), 1);
      $scope.bookInfo.$setDirty();
    };
  }]);
