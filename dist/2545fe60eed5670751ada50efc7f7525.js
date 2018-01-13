// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
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

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      
      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module;

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({4:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var supportTouch = exports.supportTouch = 'ontouchend' in document ? true : false;
},{}],3:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _env = require("./env");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TAP_DELAY_TIME = 200;
var DB_TAP_DELAY_TIME = 190;
var LONG_TAP_DELAY_TIME = 500;

/**
 * Toucher 类
 * @constructor
 * @param {DOM} target - 绑定的DOM对象
 */

var Toucher = function () {
  function Toucher(target) {
    var _this = this;

    _classCallCheck(this, Toucher);

    // init data
    Object.assign(this, {
      target: target,
      events: {},
      touchStartTime: 0,
      lastTouchTime: 0,
      x1: 0, y1: 0, x2: 0, y2: 0,
      isLongTap: false, // 用来在 touchend 时判断是否为长按
      longTapTimer: null,
      singleTapTimer: null
    });

    // 注册默认的事件函数
    var _usedMehod = ['tap', 'longTap', 'dbTap'];

    var _loop = function _loop(m) {
      _this[m] = function (fn, option) {
        _this.register(m, fn, option);
        return _this;
      };
    };

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _usedMehod[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var m = _step.value;

        _loop(m);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  /**
   * 初始化事件绑定
   */


  _createClass(Toucher, [{
    key: "init",
    value: function init() {
      this.target.addEventListener('touchstart', this._proxy('touchStart'));
      this.target.addEventListener('touchend', this._proxy('touchEnd'));
      this.target.addEventListener('touchmove', this._proxy('touchMove'));
      // DOM.addEventListener('touchcancel',actionOver);
    }

    /**
     * 调用所有向事件类型注册的回调
     * 
     * @param {String} type - 事件类型
     * @param {Event} e - 事件对象
     */

  }, {
    key: "_emit",
    value: function _emit(type, e) {
      var fns = this.events[type];
      if (fns) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = fns[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var fn = _step2.value;

            fn.call(this, e, this);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    }

    /**
     * 订阅模式，注册回调函数
     * 
     * @param {DOM} target - 绑定的DOM 对象
     * @param {String} type - 事件类型 (tap, longTap...)
     * @param {Function} fn - 回调注册
     * @param {Object} Option - 配置对象
     */

  }, {
    key: "_addEvent",
    value: function _addEvent(target, type, fn) {
      var option = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      if (!target || !target.nodeType) {
        return false;
      }

      if (typeof this.events[type] === 'undefined') {
        this.events[type] = [];
      }

      this.events[type].push(fn);
    }

    /**
     * 简单的代理函数
     * 这里绑定了 this 作用域
     * 
     * @param {String} type - 事件类型
     */

  }, {
    key: "_proxy",
    value: function _proxy(type) {
      var that = this;
      return function (e) {
        // 防止冒泡
        if (e.stopPropagation) {
          e.stopPropagation();
        }

        e.preventDefault();

        that[type](e);
      };
    }

    /**
     * start touch
     * 
     * @param {Event} e 
     */

  }, {
    key: "touchStart",
    value: function touchStart(e) {
      var _this2 = this;

      this.isLongTap = false;

      // 这里记录最新的触摸信息
      Object.assign(this, {
        x1: e.touches[0].pageX,
        y1: e.touches[0].pageY,
        x2: 0,
        y2: 0,
        touchStartTime: new Date()
      });

      // 把上一次的定时器清除
      clearTimeout(this.longTapTimer);
      this.longTapTimer = setTimeout(function () {
        // 如果超过 LONG_TAP_DELAY_TIME，判定为长按事件  
        _this2.isLongTap = true;
        _this2._emit('longTap', e);
      }, LONG_TAP_DELAY_TIME);
    }

    /**
     * 
     * @param {Event} e - 事件对象
     */

  }, {
    key: "touchMove",
    value: function touchMove(e) {}

    /**
     * touch ended
     * 
     * @param {Event} e 
     */

  }, {
    key: "touchEnd",
    value: function touchEnd(e) {
      var _this3 = this;

      // 如果已经是长按事件，其他事件不触法
      if (this.isLongTap) {
        return;
      }

      // 到这都没有触发 longTapTimer， 
      // 说明不是长按事件
      clearTimeout(this.longTapTimer);

      var now = new Date();
      console.log(this.events);
      if (!this.events['dbTap'] || this.events['dbTap'].length == 0) {
        this._emit('tap', e);
      } else if (now - this.lastTouchTime > TAP_DELAY_TIME) {
        this.singleTapTimer = setTimeout(function () {
          _this3._emit('tap', e);
        }, DB_TAP_DELAY_TIME);
      } else {
        clearTimeout(this.singleTapTimer);
        this._emit('dbTap', e);
      }
      this.lastTouchTime = now;
    }

    /**
     * 注册事件函数
     * 外部可访问接口
     * 
     * @param {String} type - 事件类型
     * @param {Function} fn - 回调
     * @param {Object} option - 配置
     */

  }, {
    key: "register",
    value: function register(type, fn, option) {
      this._addEvent(this.target, type, fn, option);
    }
  }]);

  return Toucher;
}();

exports.default = function (target, option) {
  if (!_env.supportTouch) {
    console.log('当前环境不支持触摸手势');
    return null;
  }

  var t = new Toucher(target, option);
  t.init();
  return t;
};
},{"./env":4}],2:[function(require,module,exports) {
"use strict";

var _index = require("../src/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index2.default)(document.getElementById('element2')).tap(function () {
  console.log('taped');
}).tap(function () {
  console.log('taped also');
}).longTap(function () {
  console.log('long taped');
});
/*.dbTap(()=> {
  console.log('double Taped')
})*/
},{"../src/index.js":3}],0:[function(require,module,exports) {
var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent && typeof WebSocket !== 'undefined') {
  var ws = new WebSocket('ws://' + window.location.hostname + ':64462/');
  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        window.location.reload();
      }
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
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
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(+k);
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

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id)
  });
}
},{}]},{},[0,2])