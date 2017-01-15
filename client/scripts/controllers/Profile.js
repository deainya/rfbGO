// User profile controller
module.exports = function ($rootScope, $scope, $state, auth, dataSource, Gravatar) {
  $scope.Login = function(credentials){
    auth.logIn(credentials);
    $state.go('profile');
  };
  $scope.Register = function(credentials){
    auth.Register(credentials);
    $state.go('profile');
  };

  if(auth.isLoggedIn()){
    $scope.tradepoints = false;

    // Get avatar for User from Gravatar API
    $scope.gravatarUrl = Gravatar.generate($rootScope.user.email, 80); //???

    // is User at work?
    $scope.atWork = function(){
      $rootScope.user.atWork = !$rootScope.user.atWork;
      if ($rootScope.user.atWork) {
        var obj = {action:"На работе", name: $rootScope.user.name, email: $rootScope.user.email, created:new Date()};
      } else {
        var obj = {action:"Не на работе", name: $rootScope.user.name, email: $rootScope.user.email, created:new Date()};
      }
      dataSource.set('/api/user/atwork', obj).then(function(){
        console.log(obj);
      });
      //navigator.notification.beep(2000);
    };

    // get/set Tradepoint for User
    $scope.setTradepoint = function(obj){
      dataSource.set('/api/user/tradepoint', {email: $rootScope.user.email, tradepoint: obj}).then(function(res){
        if (res.data.success) {
          $rootScope.user.tradepoint = obj;
          $state.reload();
        }
      });
    };
    $scope.getTradepoints = function(){
      $scope._tradepoints = true;
      dataSource.get('/api/tradepoints', {city: $rootScope.user.city, role: $rootScope.user.role}).then(function(res) {
        $scope.points = res.data;
      });
    };
  }
};
