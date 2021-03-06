app.controller('MainCtrl', ['$scope', '$http', '$state', 'ClientResource', 
  function($scope, $http, $state, ClientResource) {
    
    var clientQuery = ClientResource.query().$promise.then(function(clientArr) {
      for (var i=0; i<clientArr.length; i++) {
        var jobArr = clientArr[i].jobs;
        for (var x=0; x<jobArr.length; x++) {
          if (jobArr[x].clockOn) {
            runningJob = {job: jobArr[x], client: clientArr[i]};
            jobTimer = startTimer(jobArr[x]);
          }
        }
      }
      $scope.clients = clientArr;
    });

    $scope.clients = $scope.clients || clientQuery;
    var jobTimer;
    var runningJob;

    $scope.input = {open: false};
    $scope.inputToggle = function($index) {
      // Toggles open/close job input fields
      // Sets focus to input field by clientId when opened 
      var input = $scope.input;
      var clientId = this.client._id;

      if (input.open && input[$index] === true ) { //close input
        $scope.input = {open: false};
      } else if (input.open) { //close and open input                      
        $scope.input = {open: true};
        $scope.input[$index] = true;
        window.setTimeout(function(){
          var jobInput = document.querySelector("input[name ='" + clientId +"']");
          jobInput.focus();
        }, 10); //waits for DOM to load
      } else { //open input                                            
        $scope.input.open = true;
        $scope.input[$index] = true;
        window.setTimeout(function(){
          var jobInput = document.querySelector("input[name ='" + clientId +"']");
          jobInput.focus();
        }, 10);//waits for DOM to load
      }
    };

    $scope.startJob = function(jobParam, clientParam) {
      var job = jobParam || this.job; 
      var client = clientParam || this.$parent.client;

      if (runningJob) {
        console.log(runningJob.job.name + ' is currently running in ' + runningJob.client.name + '. Please stop current job first.');
      } else if (!runningJob) {
        runningJob = {job: job, client: client};

        $http.put('/api/clients/' + client._id + '/jobs/' + job._id + '/start')
        .then(function(result) {
          job.clockOn = true;
          jobTimer = startTimer(job);
        });
      }
    };

    var startTimer = function(job) {
      var initialTime = parseInt(job.totalTime, 10);
      var startTime = new Date();

      return window.setInterval(function() {
        var total = new Date() - startTime;
        $scope.$apply(function() {
          job.totalTime = initialTime + total;
        });
      }, 1000);

    };

    var stopTimer = function(timerName) {
      window.clearInterval(timerName);
    };


    $scope.stopJob = function() {
      runningJob = null;
      var job = this.job;
      var clientId = this.$parent.client._id;

      $http.put('/api/clients/' + clientId + '/jobs/' + job._id + '/stop')
      .then(function(result) {
        // set attributes to returned objects to maintain state
        var updatedJob = result.data.jobs[0];
        job.clockOn = updatedJob.clockOn;
        job.totalTime = updatedJob.totalTime;
        stopTimer(jobTimer);
      });
    };

    $scope.addJob = function(name) {
      var clientsArr = $scope.clients;
      var clientId = this.client._id;
      // get client index in arr
      // so we can update only the changed client
      var clientIndex = getIndex(clientsArr, clientId);

      $http.post('/api/clients/' + clientId + '/jobs', {jobName: name})
      .then(function(result) {
        // update changed client in scope
        var updatedClient = result.data[0];
        // the last job in the arr is new job
        var updatedJobsArr = result.data[0].jobs;
        var newJob = updatedJobsArr[updatedJobsArr.length - 1];
        $scope.clients[clientIndex].jobs.push(newJob);
        $scope.input = {open: false};
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
        // reset running job if deleted job was running
        if (runningJob && runningJob.job._id === job._id) {
          runningJob = null;
        }
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
        // reset running job if one of the client's jobs were running
        if (runningJob && runningJob.client._id === clientId) {
          runningJob = null;
        }
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