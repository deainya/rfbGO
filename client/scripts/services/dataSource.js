// services/dataSource.js
module.exports = function ($http) {
  return {
    get: function(url){
      return $http.get(url);
    },
    set: function(url, dataset){
      return $http({method: 'POST', url: url, data: {dataset}});
    }
  }
};

// Rewritable with $resource injection instead fo $http
/*module.exports = function ($resource) {
  return $resource(url+'/:id', {id: '@id'})
};*/
