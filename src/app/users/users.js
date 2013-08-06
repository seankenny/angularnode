'use strict';

angular.module( 'ngBoilerplate.users', [
  'ui.state'//, 
  // 'titleService',
  //  'plusOne'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'users', {
    url: '/users',
    views: {
      'main': {
        controller: 'UsersCtrl',
        templateUrl: 'users/users.tpl.html'
      }
    }
  });
})

.controller( 'UsersCtrl', function HomeController(  ) {
  //titleService.setTitle( 'Home' );
})

;

