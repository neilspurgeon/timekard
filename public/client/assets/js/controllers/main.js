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


