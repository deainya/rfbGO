/*angular.module('rfbgo').controller('profileCtrl', function($scope, Entity, Gravatar){
  $scope.user = Entity.setEntityWeb('/partners');
  $scope.gravatarUrl = Gravatar.generate($scope.user.email);
})*/

// controllers/profileController.js

module.exports = function ($scope, $http, Entity, Gravatar) {
  Entity.setEntityWeb('/partners');
  $scope.user = $http.get('/partners');
  $scope.gravatarUrl = Gravatar.generate($scope.user.email);
};
