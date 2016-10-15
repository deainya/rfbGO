angular.module('rfbgo').factory('Entity', function EntityFactory($http){
  return {
    getEntityWeb: function(route){
      return $http.get(route);
    },
    setEntity: function(entity){
      console.log("set: " + entity);
      this.Entity = entity;
    },
    getEntity: function(){
      console.log("get: " + this.Entity);
      return this.Entity;
    }
  }
})
