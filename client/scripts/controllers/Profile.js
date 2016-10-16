// User profile controller
module.exports = function ($scope, $rootScope, get, Entity, Gravatar) {
  // Log getObject when controller executes
  //console.log(get);
  // Assign getObject to $scope
  $scope.profile = get.data;
  //delete $scope.profile["role"];
  $scope.gravatarUrl = Gravatar.generate(get.data.email, 80);
  $rootScope.role = get.data.role;
  Entity.set($scope.profile);
};
