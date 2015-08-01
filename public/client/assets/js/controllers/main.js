app.controller('MainCtrl', ['$scope', '$http', '$state', 
  function($scope, $http, $state) {
    
    $scope.clients = [];

    $http.get('/api/clients')
    .then(function(result) {
      $scope.clients = result.data;
    });

  }
]);