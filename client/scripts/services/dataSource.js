// services/dataSource.js
module.exports = function ($http) {
  return {
    get: function(url, pms){
      //$http.defaults.headers.common['X-Auth-Token'] = session.token;
      pms = pms || {};
      return $http.get(url, {params: pms});
    },
    set: function(url, dataset){
      return $http({method: 'POST', url: url, data: {dataset}});
    },

    getFiltered: function(url, pms){
      pms = pms || {};
      return $http.get(url, {params: pms});
    }

  }
};

// Rewritable with $resource injection instead fo $http
/*module.exports = function ($resource) {
  return $resource(url+'/:id', {id: '@id'})
};*/
