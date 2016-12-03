// services/dataSource.js
module.exports = function ($http) {
  return {
    get: function(url, pms){
      pms = pms || {};
      $http.defaults.headers.common['X-Auth-Token'] = session.token;
      return $http.get(url, {params: pms});
    },
    set: function(url, dataset){
      $http.defaults.headers.common['X-Auth-Token'] = session.token;
      return $http({method: 'POST', url: url, data: {dataset}});
    }
  }
};

// Rewritable with $resource injection instead fo $http
/*module.exports = function ($resource) {
  return $resource(url+'/:id', {id: '@id'})
};*/
