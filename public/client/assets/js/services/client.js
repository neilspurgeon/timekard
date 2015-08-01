app.factory('Client', function($resource) {
  return $resource('/clients');
});
