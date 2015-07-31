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
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'MainCtrl',
        animation: {
          enter: 'slideInDown',
          leave: 'fadeOut'
        }
      });

  }

  function run() {
    FastClick.attach(document.body);
  }

})();
var app = angular.module('application');

app.controller('EntriesCtrl', ['$scope', 'Client', 
  function($scope, Client) {
    $scope.entries = Client.query();
  }
]);
var app = angular.module('application');

app.controller('MainCtrl', ['$scope', '$http', '$location', 
  function($scope, $http, $location) {

  $scope.currentUser = $http.get('/profile');
  $scope.formData = {};

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

  $scope.login = function() {
    var jsonData = 'jsonStr='+JSON.stringify($scope.formData);

    $http({
      url: '/login',
      method: 'POST',
      data: jsonData,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success( function(data) {

      $scope.currentUser = data;
      $location.path('/app');
      
      console.log($scope.currentUser.email);
    }).error(function(err){
      console.log(err);
    });
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

  // $http.get('/profile')
  // .then(function(data) {
  //   console.log(data);
  // });

}]);



var app = angular.module('application');

app.factory('Client', function($resource) {
  return $resource('/clients');
});
