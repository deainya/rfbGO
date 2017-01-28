// Users controller
module.exports = function ($rootScope, $scope, dataSource) {
  dataSource.get('/api/userslonglist', {}).then(function(res) {
    $scope.users = res.data;
  });

  $scope.SendLetter = function(email, message){

    dataSource.set('/api/user/letter', {email: email, letter: message}).then(function(res){
      if (res.data.success) {
        $scope.u.sent = true;
        //$state.reload();
      }

    });
  };
};
