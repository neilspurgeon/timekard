app.factory('Client', function($resource) {
  return $resource('/api/clients');
});
