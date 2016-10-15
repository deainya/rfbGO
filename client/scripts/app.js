import angular from 'angular'
import 'angular-ui-router'
angular.module('rfbgo', ["ui.router"])

.config(($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/')

  $stateProvider
  .state('consultant', {
    url: '/consultants',
    templateUrl: 'templates/profile.html',
    controller: 'profileCtrl'
  })

  .state('partner', {
    url: '/partners',
    templateUrl: 'templates/profile.html',
    controller: 'profileCtrl'
  })

})
