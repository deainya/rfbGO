// Orders controller
module.exports = function ($scope, $state, get, dataSource) {
  // Log getObject when controller executes
  //console.log(get);
  // Assign getObject to $scope
  $scope.orders = get.data;

  $scope.Create = function(neworder){
    angular.extend(neworder, {partner:get}, {"status":"Новый"});
    console.log(neworder);
    dataSource.set('/orders/create', neworder).then(function(){
      $state.go("orders");
    });
  };

  $scope.Cancel = function(orderid){
    dataSource.set('/orders/cancel', orderid).then(function(){
      console.log(orderid);
      $state.reload();
    });
  };

  $scope.isCancelled = function(status){ return status === "Отменён" || status === "Завершён" }; //hide

  $scope.isAccepted = function(status){ return status === "Новый" }; //show

  $scope.isResolved = function(status){ return status === "Принят" }; //show

};
