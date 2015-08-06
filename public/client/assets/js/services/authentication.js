app.factory('AuthService', ['$window', function($window) {
  var auth = {
    isLogged: $window.sessionStorage.token
  };
  return auth;
}]);