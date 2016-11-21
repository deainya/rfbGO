// services/Session.js
module.exports = function ($log, localStorage) {
  // Instantiate data when service is loaded
  this._user = JSON.parse(localStorage.getItem('session.user'));
  console.log(localStorage.getItem('session.accessToken'));
  this._accessToken = JSON.parse(localStorage.getItem('session.accessToken'));
  return {
    getUser: function(){
      return this._user;
    },
    setUser: function(user){
      this._user = user;
      localStorage.setItem('session.user', JSON.stringify(user));
      return this;
    },
    getAccessToken: function(){
      return this._accessToken;
    },
    setAccessToken: function(token){
      this._accessToken = token;
      localStorage.setItem('session.accessToken', token);
      return this;
    },
    /* Destroy session
     */
    destroy: function(){
      this.setUser(null);
      this.setAccessToken(null);
    }
  }
};
