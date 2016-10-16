// User profile controller
module.exports = function ($scope, get, Entity, Gravatar) {
  // Log getObject when controller executes
  //console.log(get);
  // Assign getObject to $scope
  $scope.profile = get.data;
  $scope.gravatarUrl = Gravatar.generate(get.data.email, 80);
  Entity.set(get.data);
};
