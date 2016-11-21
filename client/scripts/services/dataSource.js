// services/dataSource.js
module.exports = function ($http, session) {
  return {
    get: function(url, params){
      //$http.defaults.headers.common['X-Auth-Token'] = session.token;
      return $http.get(url);
    },
    set: function(url, dataset){
      return $http({method: 'POST', url: url, data: {dataset}});
    },

    /*getFiltered: function(url, pms){
      pms = pms || {};
      return $q(function(resolve, reject) {
        $http.get(url, {params: pms}).then(function(result) {
          resolve(result.data);
        });
      });
    }*/
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
