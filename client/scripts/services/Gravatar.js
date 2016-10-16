// services/Gravatar.js
module.exports = function () {
  var avatarUrl = "http://www.gravatar.com/avatar/";
  return {
    generate: function(email, size){
      //console.log(CryptoJS.MD5(email));
      return avatarUrl + CryptoJS.MD5(email) + "?size=" + size.toString();
    }
  };
};
