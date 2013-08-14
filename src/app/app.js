'use strict';

angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ngBoilerplate.home',
  'ngBoilerplate.users',
  'ui.state',
  'ui.route'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider, $locationProvider ) {
  $urlRouterProvider.otherwise( '/' );

  //$locationProvider.html5Mode(true);
  //$locationProvider.html5Mode(true);
  $locationProvider.html5Mode(true);
})

// .run( function run ( titleService ) {
//   titleService.setSuffix( ' | ngBoilerplate' );
// })

.controller( 'AppCtrl', function AppCtrl ( ) {
})

;