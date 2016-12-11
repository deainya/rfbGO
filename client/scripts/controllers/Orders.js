// Orders controller
module.exports = function ($rootScope, $scope, $state, dataSource) {
  // Get data when controller executes
  // $rootScope have to be replaced!!!
  var filter = $rootScope.filter;
  if ($rootScope.user.role === 1){
    angular.extend(filter, {tp:$rootScope.user.tradepoint.tp});
  } else {
    if (filter.city){
      angular.extend(filter, {city:$rootScope.user.tradepoint.city});
    } else {
      angular.extend(filter, {wp:$rootScope.user.tradepoint.wp});
    }
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
};

// OLD CODE

// Log getObject when controller executes //console.log(get);
// Assign getObject to $scope //$scope.orders = get.data;

/*$scope.Accept = function(orderid, setorder){
  angular.extend(setorder, {_id:orderid, "status":"Принят", consultant: {name: $rootScope.user.name, email: $rootScope.user.email}, accepted:new Date()});
  console.log(setorder);
  dataSource.set('/orders/accept', setorder).then(function(){
    $state.reload();
  });
};
$scope.Resolve = function(orderid, setorder){
  angular.extend(setorder, {_id:orderid, "status":"Завершён", resolved:new Date()});
  console.log(setorder);
  dataSource.set('/orders/resolve', setorder).then(function(){
    $state.reload();
  });
};*/
