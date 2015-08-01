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


