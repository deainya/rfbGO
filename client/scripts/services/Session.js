// services/Session.js
module.exports = function ($log, $rootScope, localStorage) {
  // Instantiate data when service is loaded
  //this._user = JSON.parse(localStorage.getItem('session.user'));
  //this._accessToken = localStorage.getItem('session.accessToken');
  //console.log(this._user);
  //console.log(this._accessToken);
  return {
    getUser: function(){
      return $rootScope.user;
    },
    setUser: function(user){
      $rootScope.user = user;
      localStorage.setItem('session.user', JSON.stringify(user));
      return $rootScope.user;
    },
    getAccessToken: function(){
      return $rootScope.accessToken;
    },
    setAccessToken: function(token){
      $rootScope.accessToken = token;
      localStorage.setItem('session.accessToken', token);
      return $rootScope.accessToken;
    },
    /* Destroy session
     */
    destroy: function(){
      this.setUser(null);
      this.setAccessToken(null);
    }
  }
};
