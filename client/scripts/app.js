import angular from 'angular'
import 'angular-ui-router'
import 'angular-resource'

var EntityFactory = require('./services/Entity');
var GravatarFactory = require('./services/Gravatar');
var ProfileFactory = require('./services/Profile');
var profileCtrl = require('./controllers/profileCtrl');

angular.module('rfbgo', ["ui.router", "ngResource"])

.config(($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/')

  $stateProvider
  /*.state('consultant', {
    url: '/consultants',
    templateUrl: 'templates/profile.html',
    controller: 'profileController'
  })*/

  .state('profile', {
    url: '/partners',
    templateUrl: 'templates/profile.html',
    resolve: {
      Profile: 'Profile', // A string value resolves to a service
      profile: function(Profile){ return Profile.get('/partners').data/*.$promise*/; } // A function value resolves to the return value of the function
    },
    controller: 'profileCtrl'
  })

})

.factory('Entity', EntityFactory)
.factory('Gravatar', GravatarFactory)
//.factory('Profile', ['$resource', ProfileFactory])
.factory('Profile', ['$http', ProfileFactory])
.controller('profileCtrl', ['$scope', 'profile', 'Entity', 'Gravatar', profileCtrl])
