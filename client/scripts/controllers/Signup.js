// Signup controller
module.exports = function ($scope) {
  $scope.Register = function(neworder){
    //var entity = Entity.get();
    angular.extend(user, {created:new Date()});
    dataSource.set('/auth/signup', user).then(function(){
      $state.go("profile");
    });
  };
};
