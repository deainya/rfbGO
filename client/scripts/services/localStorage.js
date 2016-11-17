// services/localStorage.js
module.exports = function ($window) {
  if($window.localStorage){ return $window.localStorage; }
  throw new Error('Local storage support is needed');
};
