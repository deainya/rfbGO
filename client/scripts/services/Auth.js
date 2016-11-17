// services/Auth.js
module.exports = function ($http, session) {
  return {
    /* Check whether the user is logged in
     | @returns boolean
     */
    isLoggedIn: function(url){
      return (session.getUser() !== null) && (session.getUser() !== undefined);
    },
    /* Log in
     | @params credentials
     | @returns {*|Promise}
     */
    logIn: function(credentials){
      return $http
        .post('/auth/login', credentials)
        .then(function(response){
          var data = response.data;
          session.setUser(data.user); //?
          session.setAccessToken(data.token);
        });
    },
    /* Log out
     | @returns {*|Promise}
     */
    logOut: function(){
      return $http
        .get('/auth/logout')
        .then(function(response){
          // Destroy session in the browser
          session.destroy();
        });
    }
  }
};
