app.controller('MainCtrl', ['$scope', '$http', '$state', 'ClientResource', 
  function($scope, $http, $state, ClientResource) {
    
    $scope.clients = $scope.clients || ClientResource.query();
    console.log($scope.clients);

    $scope.startJob = function() {
      var job = this.job;
      var clientId = this.$parent.client._id;
      console.log(clientId);
      $http.put('/api/clients/' + clientId + '/jobs/' + job._id + '/start')
      .then(function(result) {
        console.log(result);
        job.clockOn = true;
      });
    };

    $scope.stopJob = function() {
      var job = this.job;
      var clientId = this.$parent.client._id;

      $http.put('/api/clients/' + clientId + '/jobs/' + job._id + '/stop')
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

    $scope.deleteJob = function() {
      var job = this.job;
      var clientsArr = $scope.clients;
      var clientId = this.$parent.client._id;
      var clientIndex = getIndex(clientsArr, clientId);
      var jobIndex = getIndex(clientsArr[clientIndex].jobs, job._id);

      $http.delete('/api/clients/' + clientId + '/jobs/' + job._id + '/delete')
      .then(function(result) {
        // remove job from scope
        $scope.clients[clientIndex].jobs.splice(jobIndex, 1);
      });
    };
    
    $scope.addClient = function(name) {
      ClientResource.save({name: name})
      .$promise.then(function(client) {
        $scope.clients.push(client); 
        $state.go('main');
      });
    };

    $scope.deleteClient = function() {
      var clientId = this.client._id;
      var clientsArr = $scope.clients;
      var clientIndex = getIndex(clientsArr, clientId);

      $http.delete('/api/clients/' + clientId + '/delete')
      .then(function(result){
        $scope.clients.splice(clientIndex, 1);
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