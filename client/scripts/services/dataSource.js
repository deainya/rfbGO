// services/dataSource.js
module.exports = function ($http, $q) {
  return {
    get: function(url, params){
      return $http.get(url);
    },
    set: function(url, dataset){
      return $http({method: 'POST', url: url, data: {dataset}});
    },

    getFiltered: function(url, pms){
      pms = pms || {};
      return $q(function(resolve, reject) {
        $http.get(url, params: pms).then(function(result) {
          resolve(result.data);
        });
      });
    }

  }
};

// Rewritable with $resource injection instead fo $http
/*module.exports = function ($resource) {
  return $resource(url+'/:id', {id: '@id'})
};*/
