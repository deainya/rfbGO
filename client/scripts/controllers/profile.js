angular.module('rfbgo').controller('profileCtrl', function($scope, Entity, Gravatar){
  $scope.user = Entity.setEntityWeb('/partners');
  $scope.gravatarUrl = Gravatar.generate($scope.user.email);
})
