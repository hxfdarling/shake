"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Shake = function () {
  function Shake(options) {
    _classCallCheck(this, Shake);

    if (options == null || !("handler" in options)) {
      throw new Error("Shake Options needs an handler property.");
    }

    this.hasDeviceMotion = "ondevicemotion" in window;

    this.options = {
      handler: function handler() {},
      threshold: 8,
      timeout: 1000 };
    Object.assign(this.options, options);
    this.reset();
  }

  _createClass(Shake, [{
    key: "reset",
    value: function reset() {
      this.lastTime = Date.now();
      this.lastX = null;
      this.lastY = null;
      this.lastZ = null;
    }
  }, {
    key: "start",
    value: function start() {
      this.reset();
      if (this.hasDeviceMotion) {
        window.addEventListener("devicemotion", this, false);
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.hasDeviceMotion) {
        window.removeEventListener("devicemotion", this, false);
      }
      this.reset();
    }
  }, {
    key: "devicemotion",
    value: function devicemotion(e) {
      var _e$accelerationInclud = e.accelerationIncludingGravity,
          x = _e$accelerationInclud.x,
          y = _e$accelerationInclud.y,
          z = _e$accelerationInclud.z;


      if (this.lastX === null && this.lastY === null && this.lastZ === null) {
        this.lastX = x;
        this.lastY = y;
        this.lastZ = z;
        return;
      }
      var deltaX = Math.abs(this.lastX - x);
      var deltaY = Math.abs(this.lastY - y);
      var deltaZ = Math.abs(this.lastZ - z);
      var _options = this.options,
          threshold = _options.threshold,
          timeout = _options.timeout;

      if (deltaX > threshold && deltaY > threshold || deltaX > threshold && deltaZ > threshold || deltaY > threshold && deltaZ > threshold) {
        var timeDifference = Date.now() - this.lastTime;

        if (timeDifference > timeout) {
          this.options.handler();
          this.lastTime = Date.now();
        }
      }

      this.lastX = x;
      this.lastY = y;
      this.lastZ = z;
    }
  }, {
    key: "handleEvent",
    value: function handleEvent(event) {
      if (typeof this[event.type] === "function") {
        return this[event.type](event);
      }
    }
  }]);

  return Shake;
}();

exports.default = Shake;