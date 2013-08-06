'use strict';
angular.module( 'ngBoilerplate.recovery', [
  'ui.state'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'recovery', {
    url: '/account/recovery',
    views: {
      'main': {
        controller: 'RecoveryCtrl',
        templateUrl: 'recovery/recovery.tpl.html'
      }
    }
  });
})

.controller( 'RecoveryCtrl', function HomeController(  ) {
})

;

