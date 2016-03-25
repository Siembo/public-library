
/* Test Data Controller */


/*==================================================================================================
 *==================================================================================================
 * # TestDatasController
 * - for creating and clearing test data.
 **************************************************************************************************/
publicLibraryControllers.controller('TestDatasController',
  ['$scope', '$http', '$timeout',
    function ($scope, $http, $timeout) {
      // Create test data.
      $scope.createTestData = function () {
        $scope.clearDatabase();
        $timeout( function () {
          var ddBd = new Date("1942-03-28");
          var dhBd = new Date("1945-02-15");
          var ikBd = new Date("1724-04-22");
          var ikDd = new Date("1804-02-12");
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
                    year: 2009
                  }
                },
                {
                  method: 'POST',
                  path: '/1/classes/Book',
                  body: {
                    isbn: "0465030793",
                    title: "I Am A Strange Loop",
                    year: 2000
                  }
                },
                // Create Test Data for Publishers
                {
                  method: 'POST',
                  path: '/1/classes/Publisher',
                  body: {
                    name: "Bantam Books",
                    address: "New York, USA"
                  }
                },
                {
                  method: 'POST',
                  path: '/1/classes/Publisher',
                  body: {
                    name: "Basic Books",
                    address: "New York, USA"
                  }
                },
                // Create Test Data for Authors
                {
                  method: 'POST',
                  path: '/1/classes/Author',
                  body: {
                    authorId: 1,
                    name: "Daniel Dennett",
                    birthDate: ddBd
                  }
                },
                {
                  method: 'POST',
                  path: '/1/classes/Author',
                  body: {
                    authorId: 2,
                    name: "Douglas Hofstadter",
                    birthDate: dhBd
                  }
                },
                {
                  method: 'POST',
                  path: '/1/classes/Author',
                  body: {
                    authorId: 3,
                    name: "Immanuel Kant",
                    birthDate: ikBd,
                    deathDate: ikDd
                  }
                }
              ]
            }
          })
            .success( function () {
              console.log("added 4 books, 2 publishers and 3 authors");
              // Add pointer from book to publisher
              $http( {
                method: 'GET',
                url: 'https://api.parse.com/1/classes/Publisher'
              })
                .success( function ( data) {
                  var publisherBantam = data.results[0];
                  var publisherBasic = data.results[1];
                  // add pointer for book with isbn "0553345842" to publisher "Bantam"
                  $http( {
                    method: 'GET',
                    url: 'https://api.parse.com/1/classes/Book',
                    params: {
                      where: { isbn: '0553345842'}
                    }
                  })
                    .success( function ( datas) {
                      var book = datas.results[0];
                      $http( {
                        method: 'PUT',
                        url: 'https://api.parse.com/1/classes/Book/' + book.objectId,
                        data: {
                          publisher: {
                            __type: 'Pointer',
                            className: 'Publisher',
                            objectId: publisherBantam.objectId
                          }
                        }
                      })
                        .error( function ( data) { console.log( data);});
                    });
                  // add pointer for book with isbn "0465030793" to publisher "Basic"
                  $http( {
                    method: 'GET',
                    url: 'https://api.parse.com/1/classes/Book',
                    params: {
                      where: { isbn: '0465030793'}
                    }
                  })
                    .success( function ( data) {
                      var book = data.results[0];
                      $http( {
                        method: 'PUT',
                        url: 'https://api.parse.com/1/classes/Book/' + book.objectId,
                        data: {
                          publisher: {
                            __type: 'Pointer',
                            className: 'Publisher',
                            objectId: publisherBasic.objectId
                          }
                        }
                      })
                        .error( function ( data) { console.log( data);});
                    })
                    .error( function ( data) { console.log( data);});
                });
              // Add relation from book to author
              $http( {
                method: 'GET',
                url: 'https://api.parse.com/1/classes/Author'
              })
                .success( function ( data) {
                  var authorDaniel = data.results[0];
                  var authorDouglas = data.results[1];
                  var authorImmanuel = data.results[2];
                  $http( {
                    method: 'GET',
                    url: 'https://api.parse.com/1/classes/Book'
                  })
                    .success( function ( data) {
                      data.results.forEach( function (b) {
                        if ( b.isbn == "0553345842") {
                          $http( {
                            method: 'PUT',
                            url: 'https://api.parse.com/1/classes/Book/' + b.objectId,
                            data: {
                              authors: {
                                __op: 'AddRelation',
                                objects: [
                                  {
                                    __type: 'Pointer',
                                    className: 'Author',
                                    objectId: authorDaniel.objectId
                                  },
                                  {
                                    __type: 'Pointer',
                                    className: 'Author',
                                    objectId: authorDouglas.objectId
                                  }
                                ]
                              }
                            }
                          })
                            .error( function ( data) {console.log( data);});
                        } else if (b.isbn == "1463794762") {
                          $http( {
                            method: 'PUT',
                            url: 'https://api.parse.com/1/classes/Book/' + b.objectId,
                            data: {
                              authors: {
                                __op: 'AddRelation',
                                objects: [
                                  {
                                    __type: 'Pointer',
                                    className: 'Author',
                                    objectId: authorImmanuel.objectId
                                  }
                                ]
                              }
                            }
                          })
                            .error( function ( data) {console.log( data);});
                        } else if (b.isbn == "1928565379") {
                          $http( {
                            method: 'PUT',
                            url: 'https://api.parse.com/1/classes/Book/' + b.objectId,
                            data: {
                              authors: {
                                __op: 'AddRelation',
                                objects: [
                                  {
                                    __type: 'Pointer',
                                    className: 'Author',
                                    objectId: authorImmanuel.objectId
                                  }
                                ]
                              }
                            }
                          })
                            .error( function ( data) {console.log( data);});
                        } else if (b.isbn == "0465030793") {
                          $http( {
                            method: 'PUT',
                            url: 'https://api.parse.com/1/classes/Book/' + b.objectId,
                            data: {
                              authors: {
                                __op: 'AddRelation',
                                objects: [
                                  {
                                    __type: 'Pointer',
                                    className: 'Author',
                                    objectId: authorDouglas.objectId
                                  }
                                ]
                              }
                            }
                          })
                            .error( function ( data) { console.log( data);});
                        } // end if
                      });
                    })
                    .error( function ( data) { console.log( data);});
                })
                .error( function ( data) { console.log( data);});
            })
            .error( function( data) {
              console.log( data);
              alert("OH! Something goes wrong. See the information in console.");
            });
        }, 2000);
      };

      // Clear all test data.
      $scope.clearDatabase = function () {
        // Clear all Book Data
        $http( {
          method: 'GET',
          url: 'https://api.parse.com/1/classes/Book'
        })
          .success( function( data) {
            var obs = data.results;
            obs.forEach( function( ob) {
              $http( {
                method: 'DELETE',
                url: 'https://api.parse.com/1/classes/Book/' + ob.objectId
              })
                .error( function( data) {
                  alert("OH! Something goes wrong. See the information in console.");
                  console.log( data);
                });
            });
            console.log("clear all book data.");
          })
          .error( function( data) {
            alert("OH! Something goes wrong. See the information in console.");
            console.log(data);
          });
        // Clear all Publisher Data
        $http( {
          method: 'GET',
          url: 'https://api.parse.com/1/classes/Publisher'
        })
          .success( function( data){
            var obs = data.results;
            obs.forEach( function ( ob) {
              $http( {
                method: 'DELETE',
                url: 'https://api.parse.com/1/classes/Publisher/' + ob.objectId
              })
                .error( function ( data) {
                  alert("OH! Something goes wrong. See the information in console.");
                  console.log(data);
                });
            });
            console.log("clear all publisher data.");
          })
          .error( function ( data) {
            alert("OH! Something goes wrong. See the information in console.");
            console.log( data);
          });
        // Clear all Author Data
        $http( {
          method: 'GET',
          url: 'https://api.parse.com/1/classes/Author'
        })
          .success( function ( data) {
            var obs = data.results;
            obs.forEach( function ( ob) {
              $http( {
                method: 'DELETE',
                url: 'https://api.parse.com/1/classes/Author/' + ob.objectId
              })
                .error( function ( data) {
                  alert("OH! Something goes wrong. See the information in console.");
                  console.log( data);
                });
            });
            console.log("clear all author data.");
          })
          .error( function ( data) {
            alert("OH! Something goes wrong. See the information in console.");
            console.log( data);
          });
      };
    }]);
