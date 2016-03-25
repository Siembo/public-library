
/* Book Controller */


/*=====================================================================================
 *=====================================================================================
 * # BooksController:
 * - for showAllBooks, addBook, updateBook and destroyBook.
 *
 * @param  {Object} $scope      [glue between view/model and controller]
 * @param  {Object} $location   [control the url]
 * @param  {Object} Book        [Book Factory to interact with Parse REST-ful Service]
 **************************************************************************************/
publicLibraryControllers.controller( 'BooksController',
  [ '$scope', '$location', 'Book', function ( $scope, $location, Book) {

  /**
   * ## loadingProgress
   * - once the page is loaded, only show progressbar, which will be hidden
   *   after all books are loaded, then the rest content of this page will
   *   be shown;
   */
  $scope.loadingProgress = true;

  /**
   * ## Get all books
   * - Get all book records from Parse.com. If the request is succeed,
   *   all books will be stored to an array $scope.books; otherwise,
   *   show error messages in console.
   */
  $scope.getAllBooks = function () {
    Book.loadAll()
      .success( function ( data) {
        $scope.books = data.results;
        $scope.loadingProgress = false;
      })
      .error( function ( data) { console.log( data);});
  };

  /**
   * ## tempBook
   * - Used for creating and updating a book
   * - When Creating: assign this empty book object to $scope.book
   * - When Updating: back up the selected book for checking whether the
   *   book is changed or not.
   */
  var tempBook = new Book();

  /**
   * ## prepareBook
   * - Used for creating or updating a book
   * - When Creating: create a empty book object and fill the list of
   *   bookTypeOptions
   * - When Updating: back up the selected book and set a selected book
   *   type if necessary
   */
  $scope.prepareBook = function () {
    $scope.bookTypeOptions = Book.getAllCategories();
    if ( $scope.book) {
      $scope.isSelected = true;
      tempBook = angular.copy( $scope.book);
      if ( $scope.book.category) {
        var idx = 0;
        while ( !angular.equals( $scope.bookTypeOptions[idx], $scope.book.category)) {
          idx++;
        }
        $scope.book.category = $scope.bookTypeOptions[idx];
        $scope.isDisabled = true;
      }
      // watcher whether the book has been changed or not
      $scope.$watchCollection( 'book', function (newBook) {
        if ( angular.equals( newBook, tempBook))
          { $scope.bookInfo.$setPristine();}
      });
    } else {
      $scope.book = angular.copy( tempBook);
    }
  };

  /**
   * ## addBook
   * - Used for inserting a new book record, which stored in $scope.book,
   *   to parse.com.
   * - If the request is succeed, jump to parent page;
   * - otherwise, show error messages in console.
   */
  $scope.addBook = function () {
    if ( $scope.bookInfo.$valid) {
      var newBook = {};
      newBook.isbn  = $scope.book.isbn;
      newBook.title = $scope.book.title;
      newBook.year  = $scope.book.year;
      if ( $scope.book.category) {
        newBook.category = $scope.book.category;
        if ( $scope.book.category == "Textbook" ) {
          newBook.subjectArea = $scope.book.subjectArea;
        } else if ( $scope.book.category == "Biography" ) {
          newBook.about = $scope.book.about;
        }
      }
      Book.add( newBook)
        .success( function () { $location.path('/books/manageBooks');})
        .error( function ( data) { console.log( data);});
    } else {
      console.log("Form is invalid!");
    }
  };

  /**
   * ## updateBook
   * - If a book record has been changed, sending the updated item to parse.com
   * - If the request is succeed, jump to parent page;
   * - otherwise, show error messages in console.
   */
  $scope.updateBook = function () {
    if ( $scope.bookInfo.$valid && !angular.equals( $scope.book, tempBook)) {
      var newBook = {};
      if ( $scope.book.category == "Textbook" &&
           !angular.equals( $scope.book.subjectArea, tempBook.subjectArea)) {
        newBook.category = $scope.book.category;
        newBook.subjectArea = $scope.book.subjectArea;
      } else if ( $scope.book.category == "Biography" &&
                  !angular.equals( $scope.book.about, tempBook.about)) {
        newBook.category = $scope.book.category;
        newBook.about = $scope.book.about;
      }
      newBook.objectId = $scope.book.objectId;
      Book.update( newBook)
        .success( function () { $location.path('/books/manageBooks');})
        .error( function ( data) { console.log( data);});
    } else {
      console.log("Form is invalid or you didn't change the information!");
    }
  };

  /**
   * ## destroyBook
   * - For deleting a book record which has a standard objectId defined
   *   by parse.com itself.
   * - If the request is succeed, jump to parent page;
   * - otherwise, show error messages in console.
   */
  $scope.destroyBook = function () {
    Book.destroy( $scope.book)
      .success( function () { $location.path('/books/manageBooks');})
      .error( function( data) { console.log( data);});
  };
}]);
