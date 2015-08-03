app.filter('sumTotalFilter', [function() {
  return function (data, key) {
    var sum = 0;
    for (var i = 0; i < data.length; i++) {
        sum = sum + parseInt(data[i][key]);
    }
    return sum;
  };
}]);  
