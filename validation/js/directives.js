
/* Directives */

var publicLibraryDirectives = angular.module('publicLibraryDirectives', []);

/**
 * # plStdid
 * - Compare this input value with corresponding record in Parse.com except Parse's built-in
 *   property "objectId" to make sure this value is unique.
 *
 * @return {[Boolean]}          [when the value exists, return false; otherwise return true]
 */
publicLibraryDirectives.directive('plStdid', ['$q', '$timeout', '$http',
  function ( $q, $timeout, $http) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function( scope, element, attribute, ngModel) {
        ngModel.$asyncValidators.plStdid = function( modelValue, viewValue) {
          // get the object name and its class name
          var dotPosition = attribute.ngModel.indexOf(".");
          var objectName = attribute.ngModel.substring( 0, dotPosition);
          var className = objectName[0].toUpperCase() + objectName.substring(1);

          // define query sentence
          if ( angular.isString( modelValue)) {
            var queryString = encodeURIComponent('where={"' + attribute.name + '":"'
                                                            + modelValue + '"}');
          } else {
            var queryString = encodeURIComponent('where={"' + attribute.name + '":'
                                                            + modelValue + '}');
          }
          // check database
          var defer = $q.defer();
          $timeout( function () {
            $http( {
              method: 'GET',
              url: 'https://api.parse.com/1/classes/' + className + '?' + queryString
            })
              .success( function ( data) {
                if ( data.results.length === 0) {     // no record in database
                  defer.resolve();
                } else {
                  defer.reject();
                }
              })
              .error( function ( data) {
                defer.reject();
                console.log( data);
              });
          }, 2000);
          // return an boolean value as result
          return defer.promise;
        };
      }
    };
  }]);
