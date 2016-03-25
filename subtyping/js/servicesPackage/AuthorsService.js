
/* Author Service */


publicLibraryServices.factory( 'Author',
  [ '$http', 'Person', function ( $http, Person) {

    var urlAuthor = 'https://api.parse.com/1/classes/Author/';

    function Author () {
      Person.call( this);
      this.biography = "This is my biography...";
    }
    Author.prototype = Object.create( Person.prototype);
    Author.prototype.constructor = Author;
    console.log( "Author.prototype instanceof Person: ",
                 Author.prototype instanceof Person);


    Author.loadAll = function () {
      return $http( { method: 'GET', url: urlAuthor})
        .success( function ( data) {
          data.results.forEach( function (a) {
            Person.get( a.personId).success( function ( data) {
              a.name = data.results[0].name;
            });
          });
        });
    };

    Author.get = function ( personId) {
      return $http( {
        method: 'GET', url: urlAuthor,
        params:{ where: { personId: personId}}
      });
    };

    Author.add = function ( slots) {
      Person.add( slots);
      return $http( {
        method: 'POST', url: urlAuthor,
        data: {
          personId: slots.personId,
          biography: slots.biography
        }
      });
    };

    Author.update = function ( slots) {
      Person.update( slots);
      if ( !slots.biography) {
        return $http( {
          method: 'PUT', url: urlAuthor + slots.objectId,
          data: { biography: { __op: 'Delete'}}
        });
      } else {
        return $http( {
          method: 'PUT', url: urlAuthor + slots.objectId,
          data: { biography: slots.biography}
        });
      }
    };

    Author.destroy = function ( slots) {
      return $http( {
        method: 'DELETE', url: urlAuthor + slots.objectId
      })
        .success( function () {
          Person.destroy( slots);
        });
    };

    return Author;
  }]);
