
/* Publisher Controller */


/*==================================================================================================
 *==================================================================================================
 * # PublishersController
 * - for showAllPublishers, addPublisher, updatePublisher and destroyPublisher.
 *
 * @param  {Object} $scope      [glue between view/model and controller]
 * @param  {Object} $location   [control the url]
 * @param  {Object} $http       [get connection with parse.com using REST Api]
 **************************************************************************************************/
publicLibraryControllers.controller('PublishersController', ['$scope', '$location', '$http',
  function ( $scope, $location, $http) {

    /**
     * ## loadingProgress
     * - once the page is loaded, only show progressbar, which will be hidden after all data are
     *   loaded, then the rest content of this page will be shown;
     */
    $scope.loadingProgress = true;

    /**
     * ## $http: Get all publishers
     * - sent a GET request to parse.com once the controller is loaded. If the request is succeed,
     *   all publishers stored in parse.com will be loaded and saved to an array $scope.publishers;
     * - otherwise, show error messages in console.
     *
     * @type {Object}
     */
    $scope.getAllPublishers = function () {
      $http( {
        method: 'GET',
        url: 'https://api.parse.com/1/classes/Publisher'
      })
        .success( function ( data) {
          $scope.publishers = data.results;
          $scope.loadingProgress = false;
        })
        .error( function ( data) {
          console.log( data);
          alert("OH! Can NOT get all publishers. See the information in console.");
        });
    };

    /**
     * ## addPublisher
     * - send a POST request to parse.com for inserting a new publisher record which stored in
     *   $scope.publisher to parse.com.
     * - If the request is succeed, clear all the temporary data and jump to parent page;
     * - otherwise, show error messages in console.
     */
    $scope.addPublisher = function () {
      if ( $scope.publisherInfo.$valid) {
        $http( {
          method: 'POST',
          url: 'https://api.parse.com/1/classes/Publisher',
          data: {
            name: $scope.publisher.name,
            address: $scope.publisher.address
          }
        })
          .success( function () {
            $location.path('/publishers/managePublishers');
          })
          .error( function ( data) {
            console.log( data);
            alert("OH! Publisher is NOT added. See the information in console.");
          });
      } else {
        console.log("Form is invalid!");
      }
    };

    /**
     * ## selectPublisher
     * - When a publisher is selected, back this object up to the tempPublisher and show form.
     */
    var tempPublisher = {
      name: "",
      address: ""
    };
    $scope.selectPublisher = function () {
      $scope.isSelected = true;
      tempPublisher = angular.copy( $scope.publisher);
      // watcher whether the publisher has been changed or not
      $scope.$watchCollection( 'publisher', function ( newPublisher) {
        if ( angular.equals( newPublisher, tempPublisher)) { $scope.publisherInfo.$setPristine();}
      });
    };

    /**
     * ## updatePublisher
     * - send a PUT request to parse.com for changing publisher record, which has a standard
     *   objectId defined by parse.com itself and stored in $scope.publisher, to parse.com.
     * - If the request is succeed, clear all the temporary data and jump to parent page;
     * - otherwise, show error messages in console.
     */
    $scope.updatePublisher = function () {
      if ( $scope.publisherInfo.$valid && (angular.equals( $scope.publisher, tempPublisher) == false)) {
        $http( {
          method: 'PUT',
          url: 'https://api.parse.com/1/classes/Publisher/' + $scope.publisher.objectId,
          data: {
            address: $scope.publisher.address
          }
        })
          .success( function () { $location.path('/publishers/managePublishers');})
          .error( function ( data) {
            console.log( data);
            alert("Publisher can NOT be updated. See the information in console.");
          });
      } else {
        console.log("Form is invalid or the Publisher hasn't been changed!");
      }
    };

    /**
     * ## destroyPublisher
     * - send a DELETE request to parse.com for deleting a publisher record which has a standard
     *   objectId defined by parse.com itself.
     * - otherwise, show error messages in console.
     */
    $scope.destroyPublisher = function () {
      $http( {
        method: 'DELETE',
        url: 'https://api.parse.com/1/classes/Publisher/' + $scope.publisher.objectId
      })
        .success( function () { $location.path('/publishers/managePublishers');})
        .error( function ( data) {
          console.log( data);
          alert("Publisher can NOT be deleted. See the information in console.");
        });
    };
  }]);

