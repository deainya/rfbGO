import angular from 'angular'
import 'angular-ui-router'

var EntityFactory = require('./services/Entity');
var GravatarFactory = require('./services/Gravatar');
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

.factory('Entity', ['$http', EntityFactory])

.factory('Gravatar', GravatarFactory)

.controller('profileController', ['$scope', '$http', 'Entity', 'Gravatar', profileController])
