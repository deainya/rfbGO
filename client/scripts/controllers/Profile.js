// User profile controller
module.exports = function ($scope, get, Entity, Gravatar) {
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

  $scope.points = get.data; //get
  $scope.SavePoints = function(points){
    //var tps = new Array();
    var j = 0;
    for (var i=0; i<points.length; i++){
      if (points._active) {
        $scope.tps[j] = points[i];
        j++;
      }
    }
  }

};
