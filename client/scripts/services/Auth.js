// services/Auth.js
module.exports = function ($http, session) {
  return {
    /* Check whether the user is logged in
     | @returns boolean
     */
    isLoggedIn: function(url){
      return session.getUser() !== null;
    },
    /* Log in
     | @params credentials
     | @returns {*|Promise}
     */
    logIn: function(credentials){
      return $http
        .post('/api/login', credentials)
        .then(function(response){
          var data = response.data;
          session.setUser(data.user);
          session.setAccessToken(data.accessToken);
        });
    },
    /* Log out
     | @returns {*|Promise}
     */
    logOut: function(){
      return $http
        .get('/api/logout')
        .then(function(response){
          // Destroy session in the browser
          session.destroy();
        });
    }
  }
};
