// Users controller
module.exports = function ($rootScope, $scope, dataSource) {
  dataSource.get('/api/userslonglist', {}).then(function(res) {
    $scope.users = res.data;
  });
};
