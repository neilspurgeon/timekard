(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',
    'ngResource',

    //foundation
    'foundation'
    // 'foundation.dynamicRouting',
    // 'foundation.dynamicRouting.animations'
  ])
    .config(config)
    .run(run)
  ;

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        templateUrl: 'templates/app.html',
        controller: 'MainCtrl',
        animation: {
          enter: 'slideInDown',
          leave: 'fadeOut'
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'MainCtrl',
        animation: {
          enter: 'slideInDown',
          leave: 'fadeOut'
        }
      });

  }

  function run() {
    FastClick.attach(document.body);
  }

})();