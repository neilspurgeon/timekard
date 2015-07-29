var app = angular.module('application');

app.controller('MainCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {

  $scope.formData = {};

  $scope.login = function() {
    var jsonData = 'jsonStr='+JSON.stringify($scope.formData);

    $http({
      url: '/login',
      method: 'POST',
      data: jsonData,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data) {
      console.log(data);
      $location.path('/app');
    }).error(function(err){
      console.log(err);
    });
  };

}]);


