// User profile controller
module.exports = function ($rootScope, $scope, $state, auth, dataSource, Gravatar, socket, toastr) {

  /*socket.on('init', function (data) {
    $scope.xname = data.xname;
    $scope.xusers = data.xusers;
  });
  socket.on('user-join', function (data) {
    //$scope.messages.push({ user: 'chatroom', text: 'User ' + data.name + ' has joined.' });
    $scope.xusers.push(data.xname);
  });
  // add a message to the conversation when a user disconnects or leaves the room
  socket.on('user-left', function (data) {
    //$scope.messages.push({ user: 'chatroom', text: 'User ' + data.name + ' has left.' });
    var i, user;
    for (i = 0; i < $scope.xusers.length; i++) {
      user = $scope.xusers[i];
      if (user === data.xname) { $scope.xusers.splice(i, 1); break; }
    }
  });*/

  /*socket.on('send:message', function (message) { $scope.messages.push(message); });
  $scope.messages = [];
  $scope.sendMessage = function () {
    socket.emit('send:message', { message: $scope.message });
    // add the message to our model locally
    $scope.messages.push({ xuser: $scope.name, text: $scope.message });
    // clear message box
    $scope.message = '';
  };*/

  $scope.Login = function(credentials){
    auth.logIn(credentials,
      function(){
        $state.go('profile');
      }, function(data){
        toastr.error('Указан неверный логин или пароль', 'Ой!');
      });
  };
  $scope.Register = function(credentials){
    auth.Register(credentials, function(){
      $state.go('profile');
    });
  };

  if(auth.isLoggedIn()){
    $scope.tradepoints = false;
    // Get avatar for User from Gravatar API
    $scope.gravatarUrl = Gravatar.generate($rootScope.user.email, 80); //???
    // is User at work?
    $scope.atWork = function(){
      $rootScope.user.atWork = !$rootScope.user.atWork;
      if ($rootScope.user.atWork) {
        var obj = {action:"На работе", name: $rootScope.user.name, email: $rootScope.user.email, created:new Date()};
      } else {
        var obj = {action:"Не на работе", name: $rootScope.user.name, email: $rootScope.user.email, created:new Date()};
      }
      dataSource.set('/api/user/atwork', obj).then(function(){
        console.log(obj);
      });
    };

    // get/set Tradepoint for User
    $scope.setTradepoint = function(obj){
      dataSource.set('/api/user/tradepoint', {email: $rootScope.user.email, tradepoint: obj}).then(function(res){
        if (res.data.success) {
          $rootScope.user.tradepoint = obj;
          $state.reload();
        }
      });
    };
    $scope.getTradepoints = function(){
      $scope._tradepoints = true;
      dataSource.get('/api/tradepoints', {city: $rootScope.user.city, role: $rootScope.user.role}).then(function(res) {
        $scope.points = res.data;
      });
    };
  }
};
