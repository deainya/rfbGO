import angular from 'angular'
import 'angular-ui-router'
import 'angular-resource'

require('./sources/MD5');

var EntityFactory = require('./services/Entity');
var GravatarFactory = require('./services/Gravatar');
var Profile = require('./services/Profile');
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
        // A string value resolves to a service
        Profile: 'Profile',
        // A function value resolves to the return value of the function
        profile: function(Profile){
          return Profile.get().$promise;
      }
    },
    controller: 'profileCtrl'
})

})

.factory('Entity', EntityFactory)
.factory('Gravatar', GravatarFactory)
//.controller('profileController', ['$scope', '$http', 'Entity', 'Gravatar', profileController])

.factory('Profile', ['$resource', Profile])
.controller('profileCtrl', ['$scope', 'profile', 'Entity', 'Gravatar', profileCtrl])
