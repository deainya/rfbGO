/*
controller: function (ordersService, $stateParams, $state, $http){
  this.orders = ordersService.data;
  this.Cancel = function(orderid){
    console.log(orderid);
    $http({method: 'POST', url: `/cancelorder`, data: {orderid}}).then(function(){
      $state.reload();
    });
  };
  this.isCancel = function(status){
    return status !== "Отменён";
  };

},
controllerAs: 'ordersCtrl'
*/

module.exports = function ($scope, $state, get, Profile, Entity, Gravatar) {
  // Log customers when controller executes
  //console.log(profile);
  // Assign customers to scope
  $scope.orders = get.data;

  $scope.Cancel = function(orderid){
    Profile.set('/orders/cancel', orderid).then(function(){
      console.log(orderid);
      $state.reload();
    });
  }

  $scope.isCancel = function(status){ return status === "Отменён"; };
};
