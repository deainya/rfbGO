// Orders controller
module.exports = function ($scope, $state, get, dataSource) {
  // Log getObject when controller executes
  //console.log(get);
  // Assign getObject to $scope
  $scope.orders = get.data;

  $scope.Create = function(neworder){
    angular.extend(neworder, {partner:get}, {"status":"Новый"}); //get for partner
    delete neworder.partner.role;
    console.log(neworder);
    dataSource.set('/orders/create', neworder).then(function(){
      $state.go("orders");
    });
  };

  $scope.Accept = function(orderid){
    //angular.extend(neworder, ); //get for partner
    //delete neworder.partner.role;
    //console.log(neworder);
    var today = new Date();
    dataSource.set('/orders/accept', {_id:orderid, {consultant:get}, "status":"Принят", accepted:today.getDate()}).then(function(){
      $state.go("orders");
    });
  };
  //get for consultant

  $scope.changeStatus = function(state, orderid){
    var url ='';
    switch(state){
      case "Отменить": url = '/orders/cancel'; break;
      case "Принять":
        url = '/orders/accept';
        //???
        break;
      case "Завершить": url = '/orders/resolve'; break;
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

  $scope.isCancel = function(status){ return status === "Новый" || status === "Принят" }; //show
  $scope.isAccept = function(status){ return status === "Новый" }; //show
  $scope.isResolve = function(status){ return status === "Принят" }; //show
};
