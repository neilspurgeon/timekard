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
      .state('main', {
        url: '/',
        templateUrl: 'templates/main.html',
        controller: 'MainCtrl'
      })
      .state('main.addJob', {
        url: 'addJob',
        templateUrl: 'templates/main.addJob.html',
        controller: 'MainCtrl'
      })
      .state('addClient', {
        url: '/addClient',
        templateUrl: 'templates/main.addClientModal.html',
        controller: 'MainCtrl'
      })
      .state('createAccount', {
        url: '/createAccount',
        templateUrl: 'templates/createAccount.html',
        controller: 'UserCtrl',
        animation: {
          enter: 'slideInDown',
          leave: 'fadeOut'
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'UserCtrl',
        animation: {
          enter: 'slideInDown',
          leave: 'fadeOut'
        }
      });

      $urlRouterProvider.otherwise('/home');

  }

  function run($state,$rootScope) {
    FastClick.attach(document.body);
    $rootScope.$state = $state;
  }

})();

var app = angular.module('application');

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});