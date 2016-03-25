
/* Book Factory */


publicLibraryServices.factory( 'Book', [ '$http', function ( $http) {

  //var BookSubtype = {};
  //Object.defineProperties( BookSubtype, {
  //  TEXTBOOK: { value: 1, subjectArea:""},
  //  BIOGRAPHY: { value: 2, about:""},
  //  MAX: { value: 2},
  //  labels: { value: ["Textbook", "Biography"]}
  //});
  //

  var BookCategory = [
    "Textbook",
    "Biography"
  ];

  function Book () {
    this.isbn = "";
    this.title = "";
    this.year = 0;
    this.category = "";
    this.subjectArea = "";
    this.about = "";
  }

  Book.getAllCategories = function () {
    //return BookSubtype;
    return BookCategory;
  };

  var urlBook = 'https://api.parse.com/1/classes/Book/';

  Book.loadAll = function () {
    return $http.get(urlBook);
  };

  Book.add = function ( slots) {
    return $http( { method: 'POST', url: urlBook, data: slots});
  };

  Book.update = function ( slots) {
    return $http( { method: 'PUT', url: urlBook + slots.objectId, data: slots});
  };

  Book.destroy = function ( slots) {
    return $http( { method: 'DELETE', url: urlBook + slots.objectId});
  };

  return Book;
}]);
