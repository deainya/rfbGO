// Orders controller
module.exports = function ($scope, $state, get, dataSource) {
  // Log getObject when controller executes
  //console.log(get);
  // Assign getObject to $scope
  $scope.orders = get.data;

  $scope.Create = function(neworder){
    angular.extend(neworder, {partner:get}, {"status":"Новый"});
    delete neworder.role;
    console.log(neworder);
    dataSource.set('/orders/create', neworder).then(function(){
      $state.go("orders");
    });
  };

  $scope.changeStatus = function(state, orderid){
    var url ='';
    switch(state){
      case "Отменить": url = '/orders/cancel'; break;
      case "Принять": url = '/orders/accept'; break;
      case "Завершить": url = '/orders/resolve'; break;
      default: console.log("ouch");
    }
    console.log(url);
    if (!!url) {
      dataSource.set(url, orderid).then(function(){
        console.log(orderid);
        $state.reload();
      });
    }
  };

  $scope.isCancel = function(status){ return status === "Новый" || status === "Принят" }; //show
  $scope.isAccept = function(status){ return status === "Новый" }; //show
  $scope.isResolve = function(status){ return status === "Принят" }; //show
};
