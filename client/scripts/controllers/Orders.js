// Orders controller
module.exports = function ($scope, $state, get, dataSource, Entity) {
  // Log getObject when controller executes
  //console.log(get);
  // Assign getObject to $scope
  $scope.orders = get.data;

  $scope.Create = function(neworder){
    //var entity = Entity.get();
    angular.extend(neworder, {"status":"Новый", partner:Entity.get(), created:new Date()}); //get for partner
    delete neworder.partner.role;
    console.log(neworder);
    dataSource.set('/orders/create', neworder).then(function(){
      $state.go("orders");
    });
  };

  $scope.Accept = function(orderid, setorder){
    angular.extend(setorder, {_id:orderid, "status":"Принят", consultant:Entity.get(), accepted:new Date()}); //get for consultant
    delete setorder.consultant.role;
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
      //case "Принять":
      //  url = '/orders/accept';
        //???
      //  break;
      //case "Завершить": url = '/orders/resolve'; break;
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
