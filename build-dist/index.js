require=function(r,e,n){function t(n,o){function i(r){return t(i.resolve(r))}function f(e){return r[n][1][e]||e}if(!e[n]){if(!r[n]){var c="function"==typeof require&&require;if(!o&&c)return c(n,!0);if(u)return u(n,!0);var l=new Error("Cannot find module '"+n+"'");throw l.code="MODULE_NOT_FOUND",l}i.resolve=f;var a=e[n]=new t.Module;r[n][0].call(a.exports,i,a,a.exports)}return e[n].exports}function o(){this.bundle=t,this.exports={}}var u="function"==typeof require&&require;t.Module=o,t.modules=r,t.cache=e,t.parent=u;for(var i=0;i<n.length;i++)t(n[i]);return t}({2:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=exports.supportTouch="ontouchend"in document;
},{}],1:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),e=require("./env");function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var n=200,a=190,o=500,r=function(){function e(t){var n=this;i(this,e),Object.assign(this,{target:t,events:{},touchStartTime:0,lastTouchTime:0,x1:0,y1:0,x2:0,y2:0,isLongTap:!1,longTapTimer:null,singleTapTimer:null,_isActive:!0});var a=function(t){n[t]=function(e,i){return n.register(t,e,i),n}},o=!0,r=!1,s=void 0;try{for(var u,h=["tap","longTap","dbTap","swipeStart","swipe","swipeEnd"][Symbol.iterator]();!(o=(u=h.next()).done);o=!0){a(u.value)}}catch(t){r=!0,s=t}finally{try{!o&&h.return&&h.return()}finally{if(r)throw s}}}return t(e,[{key:"init",value:function(){this.target.addEventListener("touchstart",this._proxy("touchStart"),!1),this.target.addEventListener("touchend",this._proxy("touchEnd"),!1),this.target.addEventListener("touchmove",this._proxy("touchMove"),!1)}},{key:"stop",value:function(){this._stopWatchLongTap(),this._isActive=!1}},{key:"_emit",value:function(t,e){var i=this.events[t];if(i){var n=!0,a=!1,o=void 0;try{for(var r,s=i[Symbol.iterator]();!(n=(r=s.next()).done);n=!0){r.value.call(this,e,this)}}catch(t){a=!0,o=t}finally{try{!n&&s.return&&s.return()}finally{if(a)throw o}}}}},{key:"_addEvent",value:function(t,e,i){arguments.length>3&&void 0!==arguments[3]&&arguments[3];if(!t||!t.nodeType)return!1;void 0===this.events[e]&&(this.events[e]=[]),this.events[e].push(i)}},{key:"_proxy",value:function(t){var e=this;return function(i){i.stopPropagation&&i.stopPropagation(),i.preventDefault(),e[t](i)}}},{key:"_stopWatchLongTap",value:function(){clearTimeout(this.longTapTimer)}},{key:"touchStart",value:function(t){var e=this;this.isLongTap=!1,this._isActive=!0,Object.assign(this,{x1:t.touches[0].pageX,y1:t.touches[0].pageY,x2:0,y2:0,touchStartTime:new Date}),this._emit("swipeStart",t),this._stopWatchLongTap(),this.longTapTimer=setTimeout(function(){e.isLongTap=!0,e._emit("longTap",t)},o)}},{key:"touchMove",value:function(t){this.stop(),this._emit("swipe",t)}},{key:"touchEnd",value:function(t){var e=this;if(!this.isLongTap){if(this._emit("swipeEnd",t),this._stopWatchLongTap(),!this._isActive)return!1;var i=new Date;this.events.dbTap&&0!=this.events.dbTap.length?i-this.lastTouchTime>n?this.singleTapTimer=setTimeout(function(){e._emit("tap",t)},a):(clearTimeout(this.singleTapTimer),this._emit("dbTap",t)):this._emit("tap",t),this.lastTouchTime=i}}},{key:"register",value:function(t,e,i){this._addEvent(this.target,t,e,i)}}]),e}(),s=function(t,i){if(!e.supportTouch)return null;var n=new r(t,i);return n.init(),n};window&&!window.leenToucher&&(window.leenToucher=s),exports.default=s;
},{"./env":2}]},{},[1])