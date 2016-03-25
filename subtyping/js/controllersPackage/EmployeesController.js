
/* Employee Controller */


/*====================================================================================
 *====================================================================================
 * # EmployeesController:
 * - for showAllEmployees, addEmployee, updateEmployee and destroyEmployee.
 *
 * @param {Object} $scope [glue between view/model and controller]
 * @param {Object} $location [control the url]
 * @param {Object} Employee [Employee Factory to interact with Parse REST-ful Service]
 *************************************************************************************/
publicLibraryControllers.controller( 'EmployeesController',
  [ '$scope', '$location', 'Employee', function ( $scope, $location, Employee) {

    /**
     * ## loadingProgress
     * - once the page is loaded, only show progressbar, which will be hidden
     *   after all employees are loaded, then the rest content of this page
     *   will be shown;
     */
    $scope.loadingProgress = true;

    /**
     * ## Get all employees
     * - Get all employee records from Parse.com. If the request is succeed,
     *   all employees will be stored to an array $scope.employees; otherwise,
     *   show error messages in console.
     */
    $scope.getAllEmployees = function () {
      Employee.loadAll()
        .success( function ( data) {
          $scope.employees = data.results;
          $scope.loadingProgress = false;
        })
        .error( function ( data) { console.log( data);});
    };

    /**
     * ## tempEmployee
     * - Used for creating and updating a employee
     * - When Creating: assign this empty employee object to $scope.employee
     * - When Updating: back up the selected employee for checking whether
     *   the employee is changed or not.
     */
    var tempEmployee = new Employee();

    /**
     * ## prepareEmployee
     * - Used for creating or updating a employee
     * - When Creating: create a empty employee object
     * - When Updating: back up the selected employee
     */
    $scope.prepareEmployee = function () {
      $scope.employeeTypeOptions = Employee.getAllSubtypes();
      if ( $scope.employee) {
        $scope.isSelected = true;
        tempEmployee = angular.copy( $scope.employee);
        if ( $scope.employee.subtype) {
          var idx = 0;
          while ( !angular.equals( $scope.employeeTypeOptions[idx],
                                   $scope.employee.subtype)) {
            idx++;
          }
          $scope.employee.subtype = $scope.employeeTypeOptions[idx];
          $scope.isDisabled = true;
        }
        // watcher whether the employee has been changed or not
        $scope.$watchCollection( 'employee', function (newEmployee) {
          if ( angular.equals( newEmployee, tempEmployee))
            { $scope.employeeInfo.$setPristine();}
        });
      } else {
        $scope.employee = angular.copy( tempEmployee);
      }
    };

    /**
     * ## addEmployee
     * - Used for inserting a new employee record, which stored in
     *   $scope.employee, to parse.com.
     * - If the request is succeed, jump to parent page;
     * - otherwise, show error messages in console.
     */
    $scope.addEmployee = function () {
      if ( $scope.employeeInfo.$valid) {
        Employee.add( $scope.employee)
          .success( function () { $location.path('/employees/manageEmployees');})
          .error( function ( data) { console.log( data)});
      } else {
        console.log("Form is invalid!");
      }
    };

    /**
     * ## updateEmployee
     * - If a employee record has been changed, sending the updated item to
     *   parse.com
     * - If the request is succeed, jump to parent page;
     * - otherwise, show error messages in console.
     */
    $scope.updateEmployee = function () {
      if ( $scope.employeeInfo.$valid &&
           !angular.equals( $scope.employee, tempEmployee)) {
        Employee.update( $scope.employee)
          .success( function () { $location.path('/employees/manageEmployees');})
          .error( function ( data) { console.log( data);});
      } else {
        console.log("Form is invalid or you didn't change the information!");
      }
    };

    /**
     * ## destroyEmployee
     * - For deleting a employee record which has a standard objectId defined
     *   by parse.com itself.
     * - If the request is succeed, jump to parent page;
     * - otherwise, show error messages in console.
     */
    $scope.destroyEmployee = function () {
      Employee.destroy( $scope.employee)
        .success( function () { $location.path('/employees/manageEmployees');})
        .error( function( data) { console.log( data);});
    };
  }]);
