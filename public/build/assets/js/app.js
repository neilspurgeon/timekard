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
        controller: 'MainCtrl'
      })
      .state('createAccount', {
        url: '/createAccount',
        templateUrl: 'templates/createAccount.html',
        controller: 'UserCtrl',
        animation: {
          enter: 'slideInDown',
          leave: 'fadeOut'
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'UserCtrl',
        animation: {
          enter: 'slideInDown',
          leave: 'fadeOut'
        }
      });

      $urlRouterProvider.otherwise('/home');

  }

  function run() {
    FastClick.attach(document.body);
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
app.controller('MainCtrl', ['$scope', '$http', '$state', 
  function($scope, $http, $state) {
    
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
      console.log(clientId);
      $http.put('/api/' + clientId + '/jobs/' + job._id + '/stop')
      .then(function(result) {
        console.log(result);
        job.clockOn = false;
      });
    };

  }
]);
app.controller('UserCtrl', ['$scope', '$http', '$location', '$window', 'UserService', 'AuthenticationService',
  function($scope, $http, $location, $window, UserService, AuthenticationService) {

  $scope.createAccount = function() {
    var jsonData = 'jsonStr='+JSON.stringify($scope.formData);

    $http({
      url: '/users',
      method: 'POST',
      data: jsonData,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data) {
      $location.path('/app');
      $scope.currentUser = data;
      console.log($scope.currentUser);
    }).error(function(err){
      console.log(err);
    });
  };

  $scope.logIn = function(email, password) {
    console.log(email, password);
    if (email !== undefined && password !== undefined) {
      console.log(email + password);
      UserService.logIn(email, password).success(function(data) {
        AuthenticationService.isLogged = true;
        $window.sessionStorage.token = data.token;
        $location.path('/app');
        console.log(data);
      }).error(function(status, data) {
        console.log(status);
        console.log(data);
      });
    }
  };

  $scope.logout = function() {
    $http.post('/logout')
    .success(function() {
      $location.path('/');
      $scope.currentUser = null;
    })
    .error(function(err) {
      console.log(err);
    });
  };

}]);



app.factory('AuthenticationService', function() {
  var auth = {
    isLogged: false
  };
  return auth;
});
app.factory('Client', function($resource) {
  return $resource('/api/clients');
});

app.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
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
 
        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {
            if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
                AuthenticationService.isAuthenticated = true;
            }
            return response || $q.when(response);
        },
 
        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
                delete $window.sessionStorage.token;
                AuthenticationService.isAuthenticated = false;
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