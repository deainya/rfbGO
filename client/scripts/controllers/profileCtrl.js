/*angular.module('rfbgo').controller('profileCtrl', function($scope, Entity, Gravatar){
  $scope.user = Entity.setEntityWeb('/partners');
  $scope.gravatarUrl = Gravatar.generate($scope.user.email);
})*/

// controllers/profileController.js

/*module.exports = function ($scope, $http, Entity, Gravatar) {
  Entity.setEntityWeb('/partners');
  $scope.user = $http.get('/partners');
  console.log($scope.user);
  $scope.gravatarUrl = Gravatar.generate($scope.user.email);
};*/

module.exports = function ($scope, profile, Entity, Gravatar) {
  // Log customers when controller executes
  //console.log(profile);
  // Assign customers to scope
  $scope.profile = profile;
  $scope.gravatarUrl = Gravatar.generate(profile.email, 80);
  Entity.setEntity(profile);
};
