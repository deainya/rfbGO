// services/Entity.js
module.exports = function () {
  return {
    getEntity: function(){
      console.log("get: " + JSON.stringify(this.Entity));
      return this.Entity;
    },
    setEntity: function(entity){
      console.log("set: " + JSON.stringify(entity));
      this.Entity = entity;
    }
  }
};
