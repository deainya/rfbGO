// User profile controller
module.exports = function ($scope, $rootScope, dataSource, Gravatar) {
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
  /*$scope.SavePoints = function(points){
    //var tps = new Array();
    var j = 0;
    for (var i=0; i<$scope.points.length; i++){
      if ($scope.points._active) {
        $scope.tps[j] = $scope.points[i];
        j++;
      }
    }
  }*/

  //$scope.points = get.data;
  $scope.gravatarUrl = Gravatar.generate($rootScope.user.email, 80);

  $scope.Filter = function(){
    dataSource.getFiltered('/tradepoints', {city: $rootScope.user.city}).then(function(res) {
      $scope.points = res.data;
      console.log($scope.points);
    });
  };

};
