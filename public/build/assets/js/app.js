(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider'];

  function config($urlProvider, $locationProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

  function run() {
    FastClick.attach(document.body);
  }

})();

var app = angular.module('application');

app.controller('MainCtrl', ['$scope', '$http', '$location', 
  function($scope, $http, $location) {

  $scope.currentUser = null;
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
      console.log(data);
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
    }).success(function(data) {
      $location.path('/app');
      $scope.currentUser = data;
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

}]);


