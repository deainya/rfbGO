import angular from 'angular'
import 'angular-ui-router'
angular.module('rfbgo', ["ui.router"])

.config(($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/#/')

})
