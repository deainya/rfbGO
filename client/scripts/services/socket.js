module.exports = function ($rootScope, socket){
  var socket = io.connect();
  return {
    on: function (eventName,callback){
      socket.on(eventName,function(){
        var args = [].slice.call(arguments);
        $rootScope.$apply(function(){
          if(callback){
            callback.apply(socket,args);
          }
        });
      });
    },
    emit: function (eventName, data, callback){
      var args = [].slice.call(arguments), cb;
      if( typeof args[args.length-1]  == "function" ){
        cb = args[args.length-1];
        args[args.length-1] = function(){
          var args = [].slice.call(arguments);
          $rootScope.$apply(function(){
            if(cb){
              cb.apply(socket,args);
            }
          });
        };
      }
      socket.emit.apply(socket, args);
    }
  };
};
