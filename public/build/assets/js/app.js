(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',
    'ngResource',

    //foundation
    'foundation'
    // 'foundation.dynamicRouting',
    // 'foundation.dynamicRouting.animations'
  ])
    .config(config)
    .run(run)
  ;

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'templates/main.html',
        controller: 'MainCtrl',
        authenticate: true
      })
      .state('main.addJob', {
        url: 'addJob',
        templateUrl: 'templates/main.addJob.html',
        controller: 'MainCtrl',
        authenticate: true
      })
      .state('addClient', {
        url: '/addClient',
        templateUrl: 'templates/main.addClient.html',
        controller: 'MainCtrl',
        authenticate: true
      })
      .state('createAccount', {
        url: '/createAccount',
        templateUrl: 'templates/createAccount.html',
        controller: 'UserCtrl',
        animation: {
          enter: 'slideInDown',
          leave: 'fadeOut'
        },
        authenticate: false
      })
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'UserCtrl',
        animation: {
          enter: 'slideInDown',
          leave: 'fadeOut'
        },
        authenticate: false
      });

      $urlRouterProvider.otherwise('/home');

  }

  function run($state, $rootScope, AuthService) {
    FastClick.attach(document.body);
    $rootScope.$state = $state;

    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams) {
        if (toState.authenticate && !AuthService.isLogged) {
          console.log(AuthService.isLogged)
          $state.go('login');
          event.preventDefault();
        }
      });
  }

})();

var app = angular.module('application');

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});
app.controller('EntriesCtrl', ['$scope', 'Client', 
  function($scope, Client) {
    $scope.entries = Client.query();
  }
]);
app.controller('MainCtrl', ['$scope', '$http', '$state', 'ClientResource', 
  function($scope, $http, $state, ClientResource) {
    
    var clientQuery = ClientResource.query().$promise.then(function(results) {
      $scope.clients = results;
    });

    $scope.clients = $scope.clients || clientQuery;
    var jobTimer;
    var runningJob = 'init';



    var checkRunningJobs = function(clientArr) {
      runningJob = null;

      for (var i=0; i<clientArr.length; i++) {
        var jobArr = clientArr[i].jobs;
        for (var x=0; x<jobArr.length; x++) {
          if (jobArr[x].clockOn) {
            runningJob = {job: jobArr[x], client: clientArr[i]};
          }
        }
      }
    };

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

      if (runningJob && runningJob !== 'init') {
        console.log(runningJob.job.name + ' is currently running in ' + runningJob.client.name + '. Please stop current job first.');
      } else if (!runningJob && runningJob !== 'init') {
        runningJob = {job: job, client: client};

        $http.put('/api/clients/' + client._id + '/jobs/' + job._id + '/start')
        .then(function(result) {
          job.clockOn = true;
          jobTimer = startTimer(job);
        });
      } else {
        checkRunningJobs($scope.clients);
        $scope.startJob(job, client);
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
        $scope.clients[clientIndex] = updatedClient;
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
        if (runningJob.job._id === job._id) {
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
        if (runningJob.client._id === clientId) {
          runningJob = null;
        }
      });
    };
    test = function() {
      console.log(runningJob.job._id);
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
app.controller('UserCtrl', ['$scope', '$http', '$location', '$window', '$state', '$rootScope', 'UserService', 'AuthService',
  function($scope, $http, $location, $window, $state, $rootScope, UserService, AuthService) {
  
  $rootScope.authenticated = AuthService.isLogged || $window.sessionStorage.token;
  $scope.message = {};

  $scope.createAccount = function(user) {
    var jsonData = 'jsonStr='+JSON.stringify(user);

    $http({
      url: '/users',
      method: 'POST',
      data: jsonData,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
    .success(function(data) {
      AuthService.isLogged = true;
      $rootScope.authenticated = true;
      $window.sessionStorage.token = data.token;
      $state.go('main');
    }).error(function(err){
      console.log(err);
    });
  };

  $scope.logIn = function(email, password) {
    if (email !== undefined && password !== undefined) {
      UserService.logIn(email, password)
      .success(function(data) {
        AuthService.isLogged = true;
        $rootScope.authenticated = true;
        $window.sessionStorage.token = data.token;
        $state.go('main');
      })
      .error(function(status, data) {
        console.log(status);
        console.log(data);
      });
    }
  };

  $scope.logOut = function() {
    AuthService.isLogged = false;
    delete $window.sessionStorage.token;
    $rootScope.authenticated = false;
    $state.go('login');
  };

}]);



app.factory('AuthService', ['$window', function($window) {
  var auth = {
    isLogged: $window.sessionStorage.token
  };
  return auth;
}]);
app.factory('ClientResource', function($resource) {
  return $resource('/api/clients/:id');
});

app.filter('msToTimeFilter', [function() {
    return function(num) {
        var secNum = Math.floor(parseInt(num, 10) / 1000);
        var hours   = Math.floor(secNum / 3600);
        var minutes = Math.floor((secNum - (hours * 3600)) / 60);
        var seconds = secNum - (hours * 3600) - (minutes * 60);
            
        if (hours   < 10) {hours   = "0" + hours;}
        if (minutes < 10) {minutes = "0" + minutes;}
        if (seconds < 10) {seconds = "0" + seconds;}
        var time    = hours + ':' + minutes + ':' + seconds;
        return time;
    };
}]);  
app.filter('sumTotalFilter', [function() {
  return function (data, key) {
    var sum = 0;
    for (var i = 0; i < data.length; i++) {
        sum = sum + parseInt(data[i][key]);
    }
    return sum;
  };
}]);  

app.factory('TokenInterceptor', function ($q, $window, $location, AuthService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },
 
        requestError: function(rejection) {
            return $q.reject(rejection);
        },
 
        /* Set Auth.isAuthenticated to true if 200 received */
        response: function (response) {
            if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthService.isAuthenticated) {
                AuthService.isAuthenticated = true;
            }
            return response || $q.when(response);
        },
 
        /* Revoke client auth if 401 is received */
        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || AuthService.isAuthenticated)) {
                delete $window.sessionStorage.token;
                AuthService.isAuthenticated = false;
                $location.path("/admin/login");
            }
 
            return $q.reject(rejection);
        }
    };
});
app.factory('UserService', function($http) {
  return {
    logIn: function(email, password) {
        return $http.post('/login', {email: email, password: password});
    },
    logOut: function() {
    }
  };
});