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
        controller: 'MainCtrl',
        authenticate: true
      })
      .state('main.addJob', {
        url: 'addJob',
        templateUrl: 'templates/main.addJob.html',
        controller: 'MainCtrl',
        authenticate: true
      })
      .state('addClient', {
        url: '/addClient',
        templateUrl: 'templates/main.addClient.html',
        controller: 'MainCtrl',
        authenticate: true
      })
      .state('createAccount', {
        url: '/createAccount',
        templateUrl: 'templates/createAccount.html',
        controller: 'UserCtrl',
        animation: {
          enter: 'slideInDown',
          leave: 'fadeOut'
        },
        authenticate: false
      })
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'UserCtrl',
        animation: {
          enter: 'slideInDown',
          leave: 'fadeOut'
        },
        authenticate: false
      });

      $urlRouterProvider.otherwise('/');

  }

  function run($state, $rootScope, AuthService) {
    FastClick.attach(document.body);
    $rootScope.$state = $state;

    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams) {
        if (toState.authenticate && !AuthService.isLogged) {
          console.log(AuthService.isLogged)
          $state.go('login');
          event.preventDefault();
        }
      });
  }

})();

var app = angular.module('application');

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});