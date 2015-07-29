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

