// Tradepoints controller
module.exports = function ($scope, get) {
  $scope.pts = get.data;
  console.log($scope.pts)
};
