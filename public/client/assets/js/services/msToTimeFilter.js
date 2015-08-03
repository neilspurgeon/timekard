app.filter('msToTimeFilter', [function() {
    return function(num) {
        var secNum = Math.floor(parseInt(num, 10) / 1000);
        var hours   = Math.floor(secNum / 3600);
        var minutes = Math.floor((secNum - (hours * 3600)) / 60);
        var seconds = secNum - (hours * 3600) - (minutes * 60);
            
        if (hours   < 10) {hours   = "0" + hours;}
        if (minutes < 10) {minutes = "0" + minutes;}
        if (seconds < 10) {seconds = "0" + seconds;}
        var time    = hours + ':' + minutes + ':' + seconds;
        return time;
    };
}]);  