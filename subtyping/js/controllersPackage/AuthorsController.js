
/* Author Controller */


/*=======================================================================================
 *=======================================================================================
 * # AuthorsController:
 * - for showAllAuthors, addAuthor, updateAuthor and destroyAuthor.
 *
 * @param  {Object} $scope      [glue between view/model and controller]
 * @param  {Object} $location   [control the url]
 * @param  {Object} Author      [Author Factory to interact with Parse REST-ful Service]
 ****************************************************************************************/
publicLibraryControllers.controller( 'AuthorsController',
  [ '$scope', '$location', 'Author', function ( $scope, $location, Author) {

    /**
     * ## loadingProgress
     * - once the page is loaded, only show progressbar, which will be hidden
     *   after all authors are loaded, then the rest content of this page will
     *   be shown;
     */
    $scope.loadingProgress = true;

    /**
     * ## Get all authors
     * - Get all author records from Parse.com. If the request is succeed, all
     *   authors will be stored to an array $scope.authors; otherwise, show
     *   error messages in console.
     */
    $scope.getAllAuthors = function () {
      Author.loadAll()
        .success( function ( data) {
          $scope.authors = data.results;
          $scope.loadingProgress = false;
        })
        .error( function ( data) { console.log( data);});
    };

    /**
     * ## tempAuthor
     * - Used for creating and updating a author
     * - When Creating: assign this empty author object to $scope.author
     * - When Updating: back up the selected author for checking whether
     *   the author is changed or not.
     */
    var tempAuthor = new Author();

    /**
     * ## prepareAuthor
     * - Used for creating or updating a author
     * - When Creating: create a empty author object
     * - When Updating: back up the selected author
     */
    $scope.prepareAuthor = function () {
      if ( $scope.author) {
        $scope.isSelected = true;
        tempAuthor = angular.copy( $scope.author);
        // watcher whether the author has been changed or not
        $scope.$watchCollection( 'author', function (newAuthor) {
          if ( angular.equals( newAuthor, tempAuthor))
            { $scope.authorInfo.$setPristine();}
        });
      } else {
        $scope.author = angular.copy( tempAuthor);
      }
    };

    /**
     * ## addAuthor
     * - Used for inserting a new author record, which stored in $scope.author,
     *   to parse.com.
     * - If the request is succeed, jump to parent page;
     * - otherwise, show error messages in console.
     */
    $scope.addAuthor = function () {
      if ( $scope.authorInfo.$valid) {
        Author.add( $scope.author)
          .success( function () { $location.path('/authors/manageAuthors');})
          .error( function ( data) { console.log( data)});
      } else {
        console.log("Form is invalid!");
      }
    };

    /**
     * ## updateAuthor
     * - If a author record has been changed, sending the updated item to parse.com
     * - If the request is succeed, jump to parent page;
     * - otherwise, show error messages in console.
     */
    $scope.updateAuthor = function () {
      if ( $scope.authorInfo.$valid && !angular.equals( $scope.author, tempAuthor)) {
        Author.update( $scope.author)
          .success( function () { $location.path('/authors/manageAuthors');})
          .error( function ( data) { console.log( data);});
      } else {
        console.log("Form is invalid or you didn't change the information!");
      }
    };

    /**
     * ## destroyAuthor
     * - For deleting a author record which has a standard objectId defined by
     *   parse.com itself.
     * - If the request is succeed, jump to parent page;
     * - otherwise, show error messages in console.
     */
    $scope.destroyAuthor = function () {
      Author.destroy( $scope.author)
        .success( function () { $location.path('/authors/manageAuthors');})
        .error( function( data) { console.log( data);});
    };
}]);
