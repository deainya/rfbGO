import angular from 'angular'
import 'angular-ui-router'

var Entity = require('./services/Entity');
var profileController = require('./controllers/profileController');

angular.module('rfbgo', ["ui.router"])

.config(($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/')

  $stateProvider
  .state('consultant', {
    url: '/consultants',
    templateUrl: 'templates/profile.html',
    controller: 'profileController'
  })

  .state('partner', {
    url: '/partners',
    templateUrl: 'templates/profile.html',
    controller: 'profileController'
  })

})
