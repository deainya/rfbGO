// Signup controller
module.exports = function ($http, $q, $scope, $state, dataSource) {

  $scope.Login = function(user){
    return $q(function(resolve, reject) { // Q, are you read me?! :)
      $http.post('/auth/login', user).then(function(res) {
        if (res.data.success) {
          resolve(res.data.message); // What the fuck is 'resolve()'?
          setUser(res.data.user);
          setAccessToken(res.data.token);
        }
        else { reject(res.data.message); }
      });
    });
  };

  $scope.Signup = function(user){
    return $q(function(resolve, reject) {
      $http.post('/auth/signup', user).then(function(res) {
        if (res.data.success) {
          resolve(res.data.message);
        }
        else { reject(result.data.message); }
      });
    });
  };

};

/*
var leadsFromServer = new Array();
for (var i=0; i<data.length; i++) {
  $scope.leads[i] = new Leads(data[i].coordinates, data[i].number, data[i].state, data[i].address, data[i].tradepoint, data[i].customer, data[i].date);
}
});
*/


    //angular.extend(user, {created:new Date()});
    //dataSource.set('/auth/signup', user).then(function(){
    //  $state.go("profile");
    //});

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
