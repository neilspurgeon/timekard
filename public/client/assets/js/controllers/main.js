app.controller('MainCtrl', ['$scope', '$http', 
  function($scope, $http) {

    $scope.getClients = function() {
      console.log('get clients...');
      $http.get('/api/clients')
      .success(function(data) {
        console.log(data);
      })
      .error(function(err) {
        console.log(err);
      });
    };
  }
]);