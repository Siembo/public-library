
/* Person Service */


publicLibraryServices.factory( 'Person', [ '$http', function ( $http) {

  var PersonSubtypes = {};
  Object.defineProperties( PersonSubtypes, {
    AUTHOR: { value: "https://api.parse.com/1/classes/Author"},
    EMPLOYEE: { value: "https://api.parse.com/1/classes/Employee"},
    LIST: { value: [ "Author", "Employee"]}
  });

  function Person () {
    this.personId = 0;
    this.name = "";
  }

  var urlPerson = "https://api.parse.com/1/classes/Person/";

  Person.loadAll = function () {
    return $http( {
      method: 'GET', url: urlPerson
    });
  };

  Person.get = function ( personId) {
    return $http( {
      method: 'GET', url: urlPerson,
      params:{ where: { personId: personId}}
    });
  };

  Person.add = function ( slots) {
    return $http( {
      method: 'POST', url: urlPerson,
      data: {
        personId: slots.personId,
        name: slots.name
      }
    });
  };

  Person.update = function ( slots) {
    Person.get( slots.personId)
      .success( function ( data) {
        return $http( {
          method: 'PUT', url: urlPerson + data.results[0].objectId,
          data: { name: slots.name}
        });
      });
  };

  Person.destroy = function ( slots) {
    return $http( {
      method: 'GET', url: PersonSubtypes.AUTHOR,
      params: { where: { personId: slots.personId}}
    })
      .success( function ( data) {
        if ( data.results.length === 0) { // no author
          $http( {
            method: 'GET', url: PersonSubtypes.EMPLOYEE,
            params: { where: { personId: slots.personId}}
          })
            .success( function ( data) {
              if ( data.results.length === 0) { // no employee
                Person.get( slots.personId)
                  .success( function ( data) {
                    $http( {
                      method: 'DELETE', url: urlPerson + data.results[0].objectId
                    });
                  });
              }
            });
        }
      });
  };

  return Person;
}]);
