
/* Test Data Controller */


/*========================================================================
 *========================================================================
 * # TestDatasController
 * - for creating and clearing test data.
 *************************************************************************/
publicLibraryControllers.controller( 'TestDatasController',
  [ '$scope', '$http', '$timeout', function ( $scope, $http, $timeout) {
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
                  year: 2009,
                  subtype: "Textbook",
                  subjectArea: "Philosophy"
                }
              },
              {
                method: 'POST',
                path: '/1/classes/Book',
                body: {
                  isbn: "3498024914",
                  title: "Kants Welt",
                  year: 2003,
                  subtype: "Biography",
                  about: "Immanuel Kant"
                }
              },
              // Create Test Data for Persons
              {
                method: 'POST',
                path: '/1/classes/Person',
                body: {
                  personId: 1001,
                  name: "Gerd Wagner"
                }
              },
              {
                method: 'POST',
                path: '/1/classes/Person',
                body: {
                  personId: 1002,
                  name: "Tom Boss"
                }
              },
              {
                method: 'POST',
                path: '/1/classes/Person',
                body: {
                  personId: 1077,
                  name: "Immanuel Kant"
                }
              },
              // Create Test Data for Employees
              {
                method: 'POST',
                path: '/1/classes/Employee',
                body: {
                  personId: 1001,
                  empNo: 21035
                }
              },
              {
                method: 'POST',
                path: '/1/classes/Employee',
                body: {
                  personId: 1002,
                  empNo: 23107,
                  subtype: "Manager",
                  department: "Faculty 1"
                }
              },
              // Create Test Data for Authors
              {
                method: 'POST',
                path: '/1/classes/Author',
                body: {
                  personId: 1001,
                  biography: "Born in ..."
                }
              },
              {
                method: 'POST',
                path: '/1/classes/Author',
                body: {
                  personId: 1077,
                  biography: "Kant was ..."
                }
              }
            ]
          }
        })
          .success( function () { console.log("Succeed to build test data.");})
          .error( function( data) {
            console.log( data);
            alert("OH! Something goes wrong. See the information in console.");
          });
      }, 2000);
    };

    // Clear all test data.
    $scope.clearDatabase = function () {
      var classes = ["Book", "Person", "Employee", "Author"];
      classes.forEach( function ( c) {
        $http( {
          method: 'GET',
          url: 'https://api.parse.com/1/classes/' + c
        })
          .success( function ( data) {
            var obs = data.results;
            obs.forEach( function ( ob) {
              $http( {
                method: 'DELETE',
                url: 'https://api.parse.com/1/classes/' + c + '/' + ob.objectId
              });
            });
            console.log("clear all " + c + " data.");
          });
      });
    };
  }]);
