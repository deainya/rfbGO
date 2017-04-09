import angular from 'angular'
import 'angular-ui-router'
import 'angular-resource'
import 'angular-toastr'
//import 'socket.io'
//import 'cordova' //ionic

var Auth = require('./services/Auth');
var Session = require('./services/Session');
var dataSourceService = require('./services/dataSource');
var GravatarFactory = require('./services/Gravatar');
var localStorageFactory = require('./services/localStorage');
//var socketFactory = require('./services/socket');
var profileCtrl = require('./controllers/Profile');
var ordersCtrl = require('./controllers/Orders');
var usersCtrl = require('./controllers/Users');

angular
.module('rfbgo', ["ui.router", "ngResource", "toastr"])
.config(($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/')
  $stateProvider
  .state('home', {
    url: '/'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'profileCtrl'
  })
  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'profileCtrl'
  })
  .state('profile', {
    url: '/profile',
    templateUrl: 'templates/profile.html',
    controller: 'profileCtrl'
  })
  .state('orders', {
    url: '/orders',
    templateUrl: 'templates/orders.html',
    controller: 'ordersCtrl'
  })
  .state('orders-new', {
    url: '/orders/new',
    templateUrl: 'templates/orders-new.html',
    controller: 'ordersCtrl'
  })
  .state('users', {
    url: '/console',
    templateUrl: 'templates/users.html',
    controller: 'usersCtrl'
  })
})

.service('auth', ['$http', 'session', Auth])
.service('session', ['$log', '$rootScope', 'localStorage', Session])
.service('dataSource', ['$http', 'session', dataSourceService])
.factory('Gravatar', GravatarFactory)
.factory('localStorage', ['$window', localStorageFactory])
//.factory('socket', ['$rootScope', socketFactory])
.controller('profileCtrl', ['$rootScope', '$scope', '$state', 'auth', 'dataSource', 'Gravatar', 'toastr', profileCtrl])
.controller('ordersCtrl', ['$rootScope', '$scope', '$state', 'dataSource', ordersCtrl])
.controller('usersCtrl', ['$rootScope', '$scope', '$state', 'dataSource', usersCtrl])

.run(function ($rootScope, $state, auth, session) {
  $rootScope.auth = auth;
  $rootScope.session = session;

  var _from = new Date(); _from.setHours(0, 0, 0, 0);
  var _to = new Date(); _to.setHours(0, 0, 0, 0); _to.setDate(_to.getDate() + 1);
  $rootScope.filter = {from:_from, to:_to, city:false, status:'Любой'};

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
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    // Here we simply check if logged in but you can implement more complex logic that inspects the state to see if access is allowed or not
    if(!auth.isLoggedIn()){
      if (toState.name !== 'login' && toState.name !== 'register') {
        // Redirect to login
        $state.go('login');
        // Prevent state change
        event.preventDefault();
      }
    }
  });
})
