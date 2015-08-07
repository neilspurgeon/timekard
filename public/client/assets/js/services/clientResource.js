app.factory('ClientResource', ['$resource', function($resource) {
  return $resource('/api/clients/:id');
}]);
