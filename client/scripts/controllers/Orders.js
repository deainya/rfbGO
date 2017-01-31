// Orders controller
module.exports = function ($rootScope, $scope, $state, dataSource) {
  // Get data when controller executes
  // $rootScope have to be replaced!!!

  $scope.isDeadline = function(status, date){
    var myEndDateTime = new Date();
    var myStartDateTime = new Date(myEndDateTime - 3 * 60000);
    if ((status == 'Новый') && (myStartDateTime > Date.parse(date))) { return true; } else { return false; }
  };

  $scope.city = $rootScope.filter.city;

  var filter = {from: $rootScope.filter.from, to: $rootScope.filter.to, status: $rootScope.filter.status};
  if ($rootScope.user.role == 0) {
    if ($rootScope.filter.city) {
      angular.extend(filter, {city:$rootScope.user.tradepoint.city});
    } else {
      angular.extend(filter, {wp:$rootScope.user.tradepoint.wp});
    }
  } else if ($rootScope.user.role == 1) {
    angular.extend(filter, {tp:$rootScope.user.tradepoint.tp});
  } else if ($rootScope.user.role > 1) {
    filter = {from: $rootScope.filter.from, to: $rootScope.filter.to, status: "Все"};
  }
  dataSource.get('/api/orders', filter).then(function(res) {
    $scope.orders = res.data;
  });

  $scope.Refresh = function(state){
    if (!!state) { $state.go("orders"); } else { $state.reload(); }
  };

  //Process Order
  $scope.Process = function(state, orderid, setorder){
    var url = '';
    var obj = setorder || {};
    switch(state){
      case "Создать":
        url = '/api/orders/create';
        angular.extend(obj,
          { "status":"Новый", partner:
            { name:$rootScope.user.name, email:$rootScope.user.email, phone:$rootScope.user.phone, tradepoint:
              { city:$rootScope.user.tradepoint.city, address:$rootScope.user.tradepoint.address,
                tradepoint:$rootScope.user.tradepoint.tradepoint, wp:$rootScope.user.tradepoint.wp,
                name:$rootScope.user.tradepoint.name, tp:$rootScope.user.tradepoint.tp }
            }, created:new Date() });
        break;
      case "Принять":
        url = '/api/orders/accept';
        angular.extend(obj,
          { _id:orderid, "status":"Принят", consultant:
            { name: $rootScope.user.name, email: $rootScope.user.email, phone:$rootScope.user.phone
            }, accepted:new Date()});
        break;
      case "Завершить":
        url = '/api/orders/resolve';
        angular.extend(obj, {_id:orderid, "status":"Завершён", resolved:new Date()});
        break;
      case "Отменить":
        url = '/api/orders/cancel';
        obj = {_id:orderid};
        break;
      default: console.log("Ouch :)");
    }
    if (!!url) { dataSource.set(url, obj).then(function(){
        if (state === "Создать") { $state.go("orders"); } else { $state.reload(); }
      });
    } else { console.log("Ouch :("); }
  };

  //Order status check
  $scope.isNew = function(status){ return status === "Новый" };
  $scope.isAccept = function(status){ return status === "Принят" };
  $scope.isResolve = function(status){ return status === "Завершён" };
  $scope.isCancel = function(status){ return status === "Отменён" };



  $scope.DeleteOrder = function(orderid, role){
    dataSource.set('/api/orders/delete', {_id:orderid, role: role}).then(function(res){
      if (res.data.success) {
        $state.reload();
      }
    });
  };

};
