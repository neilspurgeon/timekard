var app = angular.module('application');

app.factory('Client', function($resource) {
  return $resource('/clients');
});
