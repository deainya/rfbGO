// services/Entity.js
module.exports = function () {
  return {
    get: function(){
      console.log("get: " + JSON.stringify(this.Entity));
      return this.Entity;
    },
    set: function(entity){
      console.log("set: " + JSON.stringify(entity));
      this.Entity = entity;
    }
  }
};
