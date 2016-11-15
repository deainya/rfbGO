// Signup controller
module.exports = function ($q, $scope, $state, dataSource) {
  $scope.Register = function(user){

    return $q(function(resolve, reject) {
      $http.post('/auth/signup', user).then(function(result) {
        console.log(result.data);
        if (result.data.success) {
          resolve(result.data.message);
        } else {
          reject(result.data.message);
        }
      });
    };

    //angular.extend(user, {created:new Date()});
    //dataSource.set('/auth/signup', user).then(function(){
    //  $state.go("profile");
    //});
  };
};


/*
var register = function(user) {
  return $q(function(resolve, reject) {
    $http.post(API_ENDPOINT.url + '/signup', user).then(function(result) {
      if (result.data.success) {
        resolve(result.data.msg);
      } else {
        reject(result.data.msg);
      }
    });
  });
};
.controller('RegisterCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = { name: '', password: '' };
  $scope.signup = function() {
    AuthService.register($scope.user).then(function(msg) {
      $state.go('outside.login');
      var alertPopup = $ionicPopup.alert({ title: 'Register success!', template: msg });
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({ title: 'Register failed!', template: errMsg });
    });
  };
})
*/
