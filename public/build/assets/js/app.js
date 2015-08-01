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
      .state('app', {
        url: '/app',
        templateUrl: 'templates/app.html',
        controller: 'MainCtrl',
        animation: {
          enter: 'slideInDown',
          leave: 'fadeOut'
        }
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

      $urlRouterProvider.otherwise('/');

  }

  function run() {
    FastClick.attach(document.body);
  }

})();

var app = angular.module('application');
app.factory('AuthenticationService', function() {
  var auth = {
    isLogged: false
  };
  return auth;
});
app.factory('Client', function($resource) {
  return $resource('/clients');
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
app.controller('EntriesCtrl', ['$scope', 'Client', 
  function($scope, Client) {
    $scope.entries = Client.query();
  }
]);
app.controller('MainCtrl', ['$scope', 
  function($scope) {

  }
]);
app.controller('UserCtrl', ['$scope', '$http', '$location', 'UserService', 'AuthenticationService',
  function($scope, $http, $location, UserService, AuthenticationService) {

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
        // $window.sessionStorage.token = data.token;
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


