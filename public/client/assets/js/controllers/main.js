app.controller('MainCtrl', ['$scope', '$http', '$state', 
  function($scope, $http, $state) {
    
    $scope.clients = [];

    $http.get('/api/clients')
    .then(function(result) {
      $scope.clients = result.data;
    });

    $scope.startJob = function() {
      var jobId = this.job._id;
      var clientId = this.$parent.client._id;
      console.log(clientId);
      $http.put('/api/' + clientId + '/jobs/' + jobId + '/start')
      .then(function(result) {
        console.log(result);
      });
    };

  }
]);