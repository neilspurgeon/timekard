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

app.controller('NavCtrl', ['$scope', '$http', '$location', function($scope, $http, $httpProvider, $location) {

  $scope.formData = {};

  $scope.login = function() {
    console.log($scope.formData);
    var jsonData = 'jsonStr='+JSON.stringify($scope.formData);

    $http({
      url: '/login',
      method: 'POST',
      data: jsonData,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data) {
      console.log(data);
      console.log($location);
      // $location.path('/app');
    }).error(function(err){
      console.log(err);
    });
  };

}]);

