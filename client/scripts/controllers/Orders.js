// Orders controller
module.exports = function ($scope, $state, get, dataSource) {
  // Log getObject when controller executes
  //console.log(get);
  // Assign getObject to $scope
  $scope.orders = get.data;

  $scope.Create = function(neworder){
    angular.extend(neworder, {partner:get}, {"status":"Новый"});
    console.log(neworder);
    Profile.set('/orders/create', neworder).then(function(){
      $state.go("orders");
    });
  };

  $scope.Cancel = function(orderid){
    Profile.set('/orders/cancel', orderid).then(function(){
      console.log(orderid);
      $state.reload();
    });
  };

  $scope.isCancel = function(status){ return status === "Отменён"; };
};
