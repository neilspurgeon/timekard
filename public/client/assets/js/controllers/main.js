app.controller('MainCtrl', ['$scope', '$http', '$state', 
  function($scope, $http, $state) {
    
    $scope.clients = [];

    $http.get('/api/clients')
    .then(function(result) {
      $scope.clients = result.data;
    });

    $scope.startJob = function() {
      var jobId = this.job._id;
      console.log(jobId);
      $http.put('/api/jobs/' + jobId + '/start')
      .then(function(result) {
        console.log(result);
      });
    };

  }
]);