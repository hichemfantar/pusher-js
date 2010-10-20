WEB_SOCKET_SWF_LOCATION = "<PUSHER_REQUIRE_ROOT>/WebSocketMain.swf";

var _require = (function () {
  
  var handleScriptLoaded;
  if (document.addEventListener) {
    handleScriptLoaded = function (elem, callback) {
      elem.addEventListener('load', callback, false)
    }
  } else {
    handleScriptLoaded = function(elem, callback) {
      elem.attachEvent('onreadystatechange', function () {
        if(elem.readyState == 'loaded') callback()
      })
    }
  }
  
  return function (deps, callback) {
    var dep_count = 0,
    dep_length = deps.length;

    function checkReady (callback) {
      dep_count++;
      if ( dep_length == dep_count ) {
        callback();
      }
    }

    function addScript (src, callback) {
      callback = callback || function(){}
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');
      script.setAttribute('src', src + '.js');
      script.setAttribute("type","text/javascript");
      script.setAttribute('async', true);

      handleScriptLoaded(script, function () {
        checkReady(callback);
      });

      head.appendChild(script);
    }   

    for(var i = 0; i < dep_length; i++) {
      addScript(deps[i], callback);
    }
  }
})();

;(function() {
  var root = '<PUSHER_REQUIRE_ROOT>';
  var deps = [],
      callback = function () {
        Pusher.ready()
      }
  // Check for JSON dependency
  if (window['JSON'] == undefined) {
    deps.push(root + '/json2');
  }
  // Check for Flash fallback dep. Wrap initialization.
  if (window['WebSocket'] == undefined) {
    deps.push(root + '/flashfallback');
    callback = function(){
      FABridge.addInitializationCallback('webSocket', function () {
        Pusher.ready();
      })
      // WebSockets.js inits on window load, which fires after script loading on chrome and firefox and makes FF insert SWF twice.
      // We want to let WS.js auto init on FF but we need this for IE
      if(!window.addEventListener) WebSocket.__initialize();
    }
  }
  
  _require(deps, callback)
  
})();