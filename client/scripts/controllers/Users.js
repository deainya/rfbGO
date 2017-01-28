// Users controller
module.exports = function ($rootScope, $scope, dataSource) {
  dataSource.get('/api/userslonglist', {}).then(function(res) {
    $scope.users = res.data;
  });

  $scope.SendLetter = function(){

    dataSource.set('/api/user/letter', {email: $scope.u.email, letter: $scope.u.message}).then(function(res){
      if (res.data.success) {
        $scope.u.sent = true;
        //$state.reload();
      }
    
  };
};
