import angular from 'angular'
import 'angular-ui-router'
import 'angular-resource'

var EntityFactory = require('./services/Entity');
var GravatarFactory = require('./services/Gravatar');
var ProfileFactory = require('./services/Profile');
var profileCtrl = require('./controllers/Profile');
var ordersCtrl = require('./controllers/Orders');

angular.module('rfbgo', ["ui.router", "ngResource"])

.config(($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/')

  $stateProvider
  .state('home', {
    url: '/'
  })

  .state('consultant', {
    url: '/consultants',
    templateUrl: 'templates/profile.html',
    resolve: {
      Profile: 'Profile', // A string value resolves to a service
      profile: function(Profile){ return Profile.get('/consultants')/*.$promise*/; } // A function value resolves to the return value of the function
    },
    controller: 'profileCtrl'
  })

  .state('profile', {
    url: '/partners',
    templateUrl: 'templates/profile.html',
    resolve: {
      Profile: 'Profile', // A string value resolves to a service
      profile: function(Profile){ return Profile.get('/partners')/*.$promise*/; } // A function value resolves to the return value of the function
    },
    controller: 'profileCtrl'
  })

  .state('orders', {
    url: '/orders',
    templateUrl: 'templates/orders.html',
    resolve: {
      Profile: 'Profile',
      get: function(Profile){ return Profile.get('/orders'); }
    },
    controller: 'ordersCtrl'
  })


})

.factory('Entity', EntityFactory)
.factory('Gravatar', GravatarFactory)
.factory('Profile', ['$http', ProfileFactory])//.factory('Profile', ['$resource', ProfileFactory])
.controller('profileCtrl', ['$scope', 'profile', 'Entity', 'Gravatar', profileCtrl])
.controller('ordersCtrl', ['$scope', '$state', 'get', 'Profile', ordersCtrl])
