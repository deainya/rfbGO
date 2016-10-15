module.exports = function ($resource) {
  return $resource('/partners/:id', {id: '@id'})
};
