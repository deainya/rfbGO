// Orders controller
module.exports = function ($rootScope, $scope, $state, dataSource, Entity) {
  // Log getObject when controller executes
  //console.log(get);
  // Assign getObject to $scope
  //$scope.orders = get.data;
  dataSource.get('/orders', $rootScope.filter).then(function(res) { //remove to Entity in future or $scope!!!
    $scope.orders = res.data;
  });

  $scope.Filter = function(){
    $state.reload();
    //dataSource.get('/orders', $rootScope.filter).then(function(res) {
    //  $scope.orders = res.data;
    //});
  };

  $scope.Create = function(neworder){
    //var entity = Entity.get();
    //partner//partner:Entity.get()
    var obj = {"status":"Новый", partner: {name: $rootScope.user.name, email: $rootScope.user.email}, created:new Date()};
    angular.extend(neworder, obj); //get for partner
    //delete neworder.partner.role;
    console.log(neworder);
    dataSource.set('/orders/create', neworder).then(function(){
      $state.go("orders");
    });
  };

  $scope.Accept = function(orderid, setorder){
    //consultant//consultant:Entity.get()
    var obj = {_id:orderid, "status":"Принят", consultant: {name: $rootScope.user.name, email: $rootScope.user.email}, accepted:new Date()};
    angular.extend(setorder, obj); //get for consultant
    //delete setorder.consultant.role;
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
  };

  $scope.changeStatus = function(state, orderid){
    var url ='';
    switch(state){
      case "Отменить": url = '/orders/cancel'; break;
      default: console.log("Ouch :)");
    }
    console.log(url);
    if (!!url) {
      dataSource.set(url, orderid).then(function(){
        console.log(orderid);
        $state.reload();
      });
    }
  };

  $scope.isNew = function(status){ return status === "Новый" };
  $scope.isAccept = function(status){ return status === "Принят" };
  $scope.isResolve = function(status){ return status === "Завершён" };
  $scope.isCancel = function(status){ return status === "Отменён" };
};
