/*module.exports = function ($resource) {
  return $resource('/partners/:id', {id: '@id'})
};*/

module.exports = function ($http) {
  return {
    get: function(url){
      return $http.get(url);
    },
    set: function(url, id){
      return $http.post(url, data: {id});
    }
  }
};
