'use strict';
angular.module( 'ngBoilerplate.signup', [
  'ui.state'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'signup', {
    url: '/signup',
    views: {
      'main': {
        controller: 'SignupCtrl',
        templateUrl: 'signup/signup.tpl.html'
      }
    }
  });
})

.controller( 'SignupCtrl', function HomeController(  ) {
})

;

