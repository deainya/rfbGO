// User profile controller
module.exports = function ($rootScope, $scope, $state, dataSource, Gravatar) {
  //$scope.points = get.data; //get
  $scope.gravatarUrl = Gravatar.generate($rootScope.user.email, 80); //???
  $scope.atWork = function(){
    $rootScope.user.atWork = !$rootScope.user.atWork;

    var obj = {email:$rootScope.user.email}; //{name: $rootScope.user.name, email: $rootScope.user.email}, action:"На работе", created:new Date()};
    angular.extend(obj, {atwork:$rootScope.user.atWork} );
    dataSource.set('/profile/atwork', obj).then(function(){
      $state.reload();
    });
    //navigator.notification.beep(2000);
  };

  $scope.SavePoints = function(points){
    $scope.tps = new Array();
    var j = 0;
    for (var i=0; i<points.length; i++){
      if (points[i]._active) {
        $scope.tps[j] = points[i];
        delete $scope.tps[j]._active;
        j++;
      }
    }

    var obj = {email:$rootScope.user.email};
    angular.extend(obj, {tradepoint:$scope.tps} );
    dataSource.set('/profile/tradepoint', obj).then(function(){
      $state.reload();
    });
  };

  $scope.Filter = function(){
    dataSource.get('/tradepoints', {city: $rootScope.user.city}).then(function(res) {
      $scope.points = res.data;
    });
  };
};
