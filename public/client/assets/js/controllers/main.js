app.controller('MainCtrl', ['$scope', '$http', 
  function($scope, $http) {
    
    $scope.clients = [];

    $http.get('/api/clients')
    .then(function(result) {
      $scope.clients = result.data;
    });

    $scope.startJob = function() {
      var job = this.job;
      var clientId = this.$parent.client._id;
      console.log(clientId);
      $http.put('/api/' + clientId + '/jobs/' + job._id + '/start')
      .then(function(result) {
        console.log(result);
        job.clockOn = true;
      });
    };

    $scope.stopJob = function() {
      var job = this.job;
      var clientId = this.$parent.client._id;

      $http.put('/api/' + clientId + '/jobs/' + job._id + '/stop')
      .then(function(result) {
        // set attributes to returned objects to maintain state
        var updatedJob = result.data.jobs[0];
        job.clockOn = updatedJob.clockOn;
        job.totalTime = updatedJob.totalTime;
      });
    };

    $scope.addJob = function() {
      var clientsArr = $scope.clients;
      var clientId = this.client._id;
      // get client index in arr
      // so we can update only the changed client
      var clientIndex = getIndex(clientsArr, clientId);

      $http.post('/api/clients/' + clientId + '/jobs', {jobName: "somejobname"})
      .then(function(result) {
        // update changed client in scope
        var updatedClient = result.data[0];
        $scope.clients[clientIndex] = updatedClient;
      });

    };

    var getIndex = function(arr, id) {
      for (var i=0; i<arr.length; i++) {
        if (arr[i]._id === id) {
          return i;
        }
      }
    };

  }
]);