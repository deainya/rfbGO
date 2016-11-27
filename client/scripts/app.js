import angular from 'angular'
import 'angular-ui-router'
import 'angular-resource'

var Auth = require('./services/Auth');
var Session = require('./services/Session');

var dataSourceService = require('./services/dataSource');

var EntityFactory = require('./services/Entity');
var GravatarFactory = require('./services/Gravatar');
var localStorageFactory = require('./services/localStorage');

var profileCtrl = require('./controllers/Profile');
var ordersCtrl = require('./controllers/Orders');

angular
.module('rfbgo', ["ui.router", "ngResource"])
.config(($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/')
  $stateProvider
  .state('home', {
    url: '/'
  })
  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html'
  })
  .state('profile', {
    url: '/profile',
    templateUrl: 'templates/profile.html',
    //resolve: {
    //  dataSource: 'dataSource', // A string value resolves to a Service
    //  get: function(dataSource){ return dataSource.get('/tradepoints')/*.$promise*/; } // A function value resolves to the return value of the function
    //},
    controller: 'profileCtrl'
  })
  .state('orders', {
    url: '/orders',
    templateUrl: 'templates/orders.html',
    resolve: {
      dataSource: 'dataSource',
      get: function(dataSource){ console.log("uno"); return dataSource.get('/orders'); }
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
.service('session', ['$log', '$rootScope', 'localStorage', Session])

.service('dataSource', ['$http', dataSourceService])//.factory('dataSource', ['$resource', dataSourceService])

.factory('Entity', EntityFactory)
.factory('Gravatar', GravatarFactory)
.factory('localStorage', ['$window', localStorageFactory])

//.controller('tradepointsCtrl', ['$scope', 'get', tradepointsCtrl])
//.controller('signupCtrl', ['$http', '$q', '$scope', '$state', 'dataSource', signupCtrl])
.controller('profileCtrl', ['$rootScope', '$scope', '$state', 'dataSource', 'Gravatar', profileCtrl])
.controller('ordersCtrl' , ['$rootScope', '$scope', '$state', 'dataSource', 'Entity'  , ordersCtrl])

.run(function ($rootScope, auth, session) {
  $rootScope.auth = auth;
  $rootScope.session = session;

  var _from = new Date(); _from.setHours(0, 0, 0, 0);
  var _to = new Date(); _to.setHours(0, 0, 0, 0); _to.setDate(_to.getDate() + 1);
  $rootScope.filter = {from:_from, to:_to, status:''};
})
//.run(function ($rootScope, $state, auth) {
  // The first... Do we realy need it?
  // Listen for location changes this happens before route or state changes
  /*$rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl){
    if(!auth.isLoggedIn()){
      // Redirect to login

      // Prevent location change
      event.preventDefault();
    }
  });*/
  // Listen for state changes when using ui-router
//  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    // Here we simply check if logged in but you can implement more complex logic that inspects the state to see if access is allowed or not
    /*if(!auth.isLoggedIn()){
      if (toState.name !== 'login' && toState.name !== 'signup') {
        // Redirect to login
        $state.go('login');
        // Prevent state change
        event.preventDefault();
      }
    }*/
//  });
//})
