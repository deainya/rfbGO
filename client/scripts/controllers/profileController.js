/*angular.module('rfbgo').controller('profileCtrl', function($scope, Entity, Gravatar){
  $scope.user = Entity.setEntityWeb('/partners');
  $scope.gravatarUrl = Gravatar.generate($scope.user.email);
})*/

// controllers/profileController.js

module.exports = function ($scope, Entity, Gravatar) {
  Entity.setEntityWeb('/partners');
  $scope.user = Entity.data;
  $scope.gravatarUrl = Gravatar.generate($scope.user.email);
};
