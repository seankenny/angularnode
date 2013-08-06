'use strict';
angular.module( 'ngBoilerplate.signin', [
  'ui.state'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'signin', {
    url: '/signin',
    views: {
      'main': {
        controller: 'SigninCtrl',
        templateUrl: 'signin/signin.tpl.html'
      }
    }
  });
})

.controller( 'SigninCtrl', function HomeController(  ) {
})

;

