angular.module('rfbgo').factory('Gravatar', function GravatarFactory(){
  var avatarUrl = "http://www.gravatar.com/avatar/";
  return {
    generate: function(email, size){
      console.log(CryptoJS.MD5(email));
      return avatarUrl + CryptoJS.MD5(email) + "?size=" + size.toString();
    }
  }
})
