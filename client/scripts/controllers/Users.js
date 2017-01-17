// Users controller
module.exports = function ($rootScope, $scope, $state, dataSource) {
  dataSource.get('/api/userslonglist', null).then(function(res) {
    $scope.users = res.data;
  });
};
