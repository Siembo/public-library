
/* Employee Service */


publicLibraryServices.factory( 'Employee',
  [ '$http', 'Person', function ( $http, Person) {

    var employeeSubtype = [
      "Manager"
    ];
    var urlEmployee = 'https://api.parse.com/1/classes/Employee/';

    function Employee () {
      Person.call( this);
      this.empNo = 0;
      this.employeeSubtype = "";
      this.department = "";
    }
    Employee.prototype = Object.create( Person.prototype);
    Employee.prototype.constructor = Employee;
    console.log( "Employee.prototype instanceof Person: ",
                 Employee.prototype instanceof Person);


    Employee.getAllSubtypes = function () {
      return employeeSubtype;
    };

    Employee.loadAll = function () {
      return $http( { method: 'GET', url: urlEmployee})
        .success( function ( data) {
          data.results.forEach( function (e) {
            Person.get( e.personId).success( function ( data) {
              e.name = data.results[0].name;
            });
          });
        });
    };

    Employee.get = function ( personId) {
      return $http( {
        method: 'GET', url: urlEmployee,
        params:{ where: { personId: personId}}
      });
    };

    Employee.add = function ( slots) {
      Person.add( slots);
      return $http( {
        method: 'POST', url: urlEmployee,
        data: {
          personId: slots.personId,
          empNo: slots.empNo,
          subtype: slots.subtype,
          department: slots.department
        }
      });
    };

    Employee.update = function ( slots) {
      Person.update( slots);
      return $http( {
        method: 'PUT', url: urlEmployee + slots.objectId,
        data: {
          empNo: slots.empNo,
          subtype: slots.subtype,
          department: slots.department
        }
      });
    };


    Employee.destroy = function ( slots) {
      return $http( {
        method: 'DELETE', url: urlEmployee + slots.objectId
      })
        .success( function () {
          Person.destroy( slots);
        });
    };

    return Employee;
  }]);
