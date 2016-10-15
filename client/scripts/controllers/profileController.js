/*angular.module('rfbgo').controller('profileCtrl', function($scope, Entity, Gravatar){
  $scope.user = Entity.setEntityWeb('/partners');
  $scope.gravatarUrl = Gravatar.generate($scope.user.email);
})*/

// controllers/profileController.js

var Entity = require('../services/Entity');
var Gravatar = require('../services/Gravatar');

module.exports = function() {
  return function ($scope, Entity, Gravatar) {
    $scope.user = Entity.setEntityWeb('/partners');
    $scope.gravatarUrl = Gravatar.generate($scope.user.email);
  };
};
