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


