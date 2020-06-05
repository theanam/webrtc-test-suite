// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"checks/peerConnection.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Created By Anam Ahmed (https://anam.co)
 * Test the browser's capability to establish RTCPeerConnection with supplied RTC Configuration
 * How to use: probeRTC(RTCParam,false, callback) // will call callback function with true or false.
 * If you don't supply the callback function it will return a Promise.
 * The promise will resolve (with total time required for the whole round trip ,in ms) or reject (with error) based on the result.
 * Setting verbose = true will print logs in console
 * @param {RTCConfiguration} rtcConfig
 * @param {Boolean} verbose
 * @param {Function} callback [optional]
 * @return {Promise}
 */
function checkPeerConnection() {
  var rtcConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var verbose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var callback = arguments.length > 2 ? arguments[2] : undefined;
  return new Promise(function (resolve, reject) {
    var rtc1 = new RTCPeerConnection();
    var rtc2 = new RTCPeerConnection();
    var dc = rtc1.createDataChannel("sender");

    var _ts = Date.now();

    function _err(err) {
      if (callback) return callback(false);
      return reject(err);
    }

    function _log() {
      var _console;

      if (!verbose) return false;

      (_console = console).log.apply(_console, arguments);
    }

    rtc1.addEventListener("icecandidate", function (ice) {
      if (!ice.candidate) return false;

      _log("🚖  First Peer Generated Candidate:", ice.candidate);

      rtc2.addIceCandidate(ice.candidate);
    });
    rtc2.addEventListener("icecandidate", function (ice) {
      if (!ice.candidate) return false;

      _log("🚖  Second Peer Generated Candidate:", ice.candidate);

      rtc1.addIceCandidate(ice.candidate);
    });
    rtc2.addEventListener("datachannel", function (evt) {
      evt.channel.addEventListener("message", function (msg) {
        _log("✉️  Message Transmission successful");

        if (msg.data === _ts.toString()) {
          if (callback) return callback(true);

          var _rcvTS = Date.now();

          rtc1.close();
          rtc2.close();
          return resolve(_rcvTS - _ts);
        }

        _err(new Error("message integrity failure"));
      });
    });
    dc.addEventListener("open", function () {
      return dc.send(_ts.toString());
    });
    rtc1.createOffer().then(function (offer) {
      _log("🍎  Created RTC Offer");

      rtc1.setLocalDescription(offer).then(function () {
        return rtc2.setRemoteDescription(offer);
      }).then(function () {
        return rtc2.createAnswer().then(function (answer) {
          _log("🍏  Created RTC Answer");

          rtc2.setLocalDescription(answer).then(function () {
            return rtc1.setRemoteDescription(answer);
          }).catch(function (e) {
            return _err(e);
          });
        }).catch(function (e) {
          return _err(e);
        });
      });
    }).catch(function (e) {
      return _err(e);
    });
  });
}

var _default = checkPeerConnection;
exports.default = _default;
},{}],"checks/mediaCapture.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Tests media capture by calling getUserMedia and analyzing the media stream
 * Created by Anam Ahmed (https://anam.co)
 * @param {MediaStreamConstraints} constraints
 * @param {Boolean} verbose
 * @param {Function} callback
 */
function checkMediaCapture() {
  var constraints = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    video: true,
    audio: true
  };
  var verbose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var callback = arguments.length > 2 ? arguments[2] : undefined;
  return new Promise(function (resolve, reject) {
    function _err(err) {
      if (callback) return callback(false);
      return reject(err);
    }

    function _log() {
      var _console;

      if (!verbose) return false;

      (_console = console).log.apply(_console, arguments);
    }

    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
      _log("🏞  Got Media stream");

      if (stream.active) {
        var tracks = stream.getTracks();
        var audioTrack = false; // check by default

        var videoTrack = false; // check by default

        var functional = [].every.call(tracks, function (_track) {
          if (_track.kind === "audio") audioTrack = true;
          if (_track.kind === "video") videoTrack = true;
          return _track.readyState === "live";
        });
        tracks.forEach(function (_track) {
          return _track.stop();
        });
        if (!functional) return _err(new Error("All requested tracks are not active"));
        if (constraints.video && !videoTrack) return _err(new Error("Video Track not found"));
        if (constraints.audio && !audioTrack) return _err(new Error("Audio Track not found"));
        return resolve(true);
      }
    }).catch(function (e) {
      _log("🛑  Failed at getting media stream");

      _err(e);
    });
  });
}

var _default = checkMediaCapture;
exports.default = _default;
},{}],"index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _peerConnection = _interopRequireDefault(require("./checks/peerConnection"));

var _mediaCapture = _interopRequireDefault(require("./checks/mediaCapture"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _RTCTest = {
  checkPeerConnection: _peerConnection.default,
  checkMediaCapture: _mediaCapture.default
};
if (typeof window !== "undefined") window._RTCTest = _RTCTest;
var _default = _RTCTest;
exports.default = _default;
},{"./checks/peerConnection":"checks/peerConnection.js","./checks/mediaCapture":"checks/mediaCapture.js"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60924" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/index.js.map