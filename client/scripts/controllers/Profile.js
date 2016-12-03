// User profile controller
module.exports = function ($rootScope, $scope, $state, dataSource, Gravatar) {
  //$scope.points = get.data; //get
  $scope.gravatarUrl = Gravatar.generate($rootScope.user.email, 80); //???
  $scope.atWork = function(){
    $rootScope.user.atWork = !$rootScope.user.atWork;

    if ($rootScope.user.atWork) {
      var obj = {action:"На работе", name: $rootScope.user.name, email: $rootScope.user.email, created:new Date()};
    } else {
      var obj = {action:"Не на работе", name: $rootScope.user.name, email: $rootScope.user.email, created:new Date()};
    }
    dataSource.set('/api/user/atwork', obj).then(function(){
      console.log(obj); //$state.reload();
    });
    //navigator.notification.beep(2000);
  };

  $scope.SavePoints = function(point){
    /*$scope.tps = new Array();
    var j = 0;
    for (var i=0; i<points.length; i++){
      if (points[i]._active) {
        $scope.tps[j] = points[i];
        delete $scope.tps[j]._active;
        j++;
      }
    }*/

    var obj = {email: $rootScope.user.email, tradepoint: point};
    dataSource.set('/api/user/tradepoint', obj).then(function(res){
      if (res.data.success) {
        $rootScope.user.tradepoint = point;
        $state.reload();
      }
    });
  };

  $scope.Filter = function(){
    dataSource.get('/api/tradepoints', {city: $rootScope.user.city}).then(function(res) {
      $scope.points = res.data;
    });
  };
};
