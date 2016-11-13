// Signup controller
module.exports = function ($scope, dataSource) {
  $scope.Register = function(user){
    angular.extend(user, {created:new Date()});
    console.log(user);
    dataSource.set('/auth/signup', user).then(function(){
      $state.go("profile");
    });
  };
};
