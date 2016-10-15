/*angular.module('rfbgo').factory('Entity', function EntityFactory($http){
  return {
    setEntity: function(entity){
      console.log("set: " + entity);
      this.Entity = entity;
    },
    setEntityWeb: function(route){
      $http.get(route).then(function(res){
        this.setEntity(res.data);
      });
    },
    getEntity: function(){
      console.log("get: " + this.Entity);
      return this.Entity;
    }
  }
})*/

// services/Entity.js

module.exports = function ($http) {
  return {
    setEntity: function(entity){
      console.log("set: " + entity);
      this.Entity = entity;
    },
    setEntityWeb: function(route){
      this.$http.get(route).then(function(res){
        console.log(res.data);
        this.eee = res.data;
        console.log(this.eee);
      });
      console.log(this.eee);
    },
    getEntity: function(){
      console.log("get: " + this.Entity);
      return this.Entity;
    }
  }
};
