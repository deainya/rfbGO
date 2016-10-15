import angular from 'angular'
import 'angular-ui-router'
import 'angular-resource'

//var EntityFactory = require('./services/Entity');
//var GravatarFactory = require('./services/Gravatar');
var profileResource = require('./services/profileResource');
var profileCtrl = require('./controllers/profileController');

angular.module('rfbgo', ["ui.router", "ngResource"])

.config(($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/')

  $stateProvider
  /*.state('consultant', {
    url: '/consultants',
    templateUrl: 'templates/profile.html',
    controller: 'profileController'
  })*/

  .state('partner', {
    url: '/partners',
    templateUrl: 'templates/profile.html',
    resolve: {
        // A string value resolves to a service
        profileResource: 'profileResource',

        // A function value resolves to the return
        // value of the function
        profile: function(profileResource){
          return profileResource.get().$promise;;
      }
    },
    controller: 'profileCtrl'
})

})

//.factory('Entity', ['$http', EntityFactory])
//.factory('Gravatar', GravatarFactory)
//.controller('profileController', ['$scope', '$http', 'Entity', 'Gravatar', profileController])

.factory('profileResource', ['$resource', profileResource])
.controller('profileCtrl', ['$scope', profileCtrl])
