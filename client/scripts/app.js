import angular from 'angular'
import 'angular-ui-router'
import 'angular-resource'

var Auth = require('./services/Auth');
var dataSourceService = require('./services/dataSource');
var Session = require('./services/Session');
var EntityFactory = require('./services/Entity');
var GravatarFactory = require('./services/Gravatar');
var signupCtrl = require('./controllers/Signup');
var profileCtrl = require('./controllers/Profile');
var ordersCtrl = require('./controllers/Orders');

angular.module('rfbgo', ["ui.router", "ngResource"])
.config(($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/')
  $stateProvider
  .state('home', {
    url: '/'
  })
  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })
  .state('profile', {
    url: '/consultants',
    templateUrl: 'templates/profile.html',
    resolve: {
      dataSource: 'dataSource', // A string value resolves to a Service
      get: function(dataSource){ return dataSource.get('/consultants')/*.$promise*/; } // A function value resolves to the return value of the function
    },
    controller: 'profileCtrl'
  })
  .state('partner', {
    url: '/partners',
    templateUrl: 'templates/profile.html',
    resolve: {
      dataSource: 'dataSource',
      get: function(dataSource){ return dataSource.get('/partners'); }
    },
    controller: 'profileCtrl'
  })
  .state('orders', {
    url: '/orders',
    templateUrl: 'templates/orders.html',
    resolve: {
      dataSource: 'dataSource',
      get: function(dataSource){ return dataSource.get('/orders'); }
    },
    controller: 'ordersCtrl'
  })
  .state('orders-new', {
    url: '/orders/new',
    templateUrl: 'templates/orders-new.html',
    resolve: {
      Entity: 'Entity',
      get: function(Entity){ return Entity.Entity; }
    },
    controller: 'ordersCtrl'
  })
})

.service('auth', ['$http', 'session', Auth])
.service('dataSource', ['$http', dataSourceService])//.factory('dataSource', ['$resource', dataSourceService])
.service('session', ['$log', 'localStorage', Session])
.factory('Entity', EntityFactory)
.factory('Gravatar', GravatarFactory)
.controller('signupCtrl', ['$q', '$scope', '$state', 'dataSource', signupCtrl])
.controller('profileCtrl', ['$scope', '$rootScope', 'get', 'Entity', 'Gravatar', profileCtrl])
.controller('ordersCtrl', ['$scope', '$state', 'get', 'dataSource', 'Entity', ordersCtrl])
