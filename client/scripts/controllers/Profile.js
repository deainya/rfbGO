// User profile controller
module.exports = function ($scope, $rootScope, $state, dataSource, Gravatar) {
  // Log getObject when controller executes
  //console.log(get);
  // Assign getObject to $scope
/*
  $scope.profile = get.data;
  //delete $scope.profile["role"];
  $scope.gravatarUrl = Gravatar.generate(get.data.email, 80);
  $rootScope.role = get.data.role;
  Entity.set($scope.profile);
*/

  //$scope.points = get.data; //get
  //console.log(points);
  //console.log(session._user);
  $scope.SavePoints = function(points){
    //console.log(points);
    $scope.tps = new Array();
    var j = 0;
    for (var i=0; i<points.length; i++){
      if (points[i]._active) {
        $scope.tps[j] = points[i];
        delete $scope.tps[j]._active;
        j++;
      }
    }
    console.log($scope.tps);

    //$state.reload();
    var obj = {email:$rootScope.user.email};
    angular.extend(obj, {tradepoint:$scope.tps} );
    console.log(obj);

    dataSource.set('/profile/tradepoint', obj).then(function(){
      $state.reload();
    });

  }

  //$scope.points = get.data;
  $scope.gravatarUrl = Gravatar.generate($rootScope.user.email, 80);

  $scope.Filter = function(){
    dataSource.getFiltered('/tradepoints', {city: $rootScope.user.city}).then(function(res) {
      $scope.points = res.data;
      console.log($scope.points);
    });
  };

};
