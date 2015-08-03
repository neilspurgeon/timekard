app.factory('ClientResource', function($resource) {
  return $resource('/api/clients/:id');
});
