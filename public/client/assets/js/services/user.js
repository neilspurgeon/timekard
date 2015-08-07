app.factory('UserService', ['$http', function($http) {
  return {
    logIn: function(email, password) {
        return $http.post('/login', {email: email, password: password});
    },
    logOut: function() {
    }
  };
}]);