export default class Shake {
  constructor(options) {
    if (options == null || !("handler" in options)) {
      throw new Error("Shake Options needs an handler property.");
    }

    // feature detect
    this.hasDeviceMotion = "ondevicemotion" in window;

    this.options = {
      handler: () => {},
      threshold: 8, // default velocity threshold for shake to register
      timeout: 1000 // default interval between events
    };
    Object.assign(this.options, options);
    this.reset();
  }

  // reset timer values
  reset() {
    this.lastTime = Date.now();
    this.lastX = null;
    this.lastY = null;
    this.lastZ = null;
  }

  // start listening for devicemotion
  start() {
    this.reset();
    if (this.hasDeviceMotion) {
      window.addEventListener("devicemotion", this, false);
    }
  }

  // stop listening for devicemotion
  stop() {
    if (this.hasDeviceMotion) {
      window.removeEventListener("devicemotion", this, false);
    }
    this.reset();
  }

  // calculates if shake did occur
  devicemotion(e) {
    const { x, y, z } = e.accelerationIncludingGravity;

    if (this.lastX === null && this.lastY === null && this.lastZ === null) {
      this.lastX = x;
      this.lastY = y;
      this.lastZ = z;
      return;
    }
    let deltaX = Math.abs(this.lastX - x);
    let deltaY = Math.abs(this.lastY - y);
    let deltaZ = Math.abs(this.lastZ - z);
    const { threshold, timeout } = this.options;
    if (
      (deltaX > threshold && deltaY > threshold) ||
      (deltaX > threshold && deltaZ > threshold) ||
      (deltaY > threshold && deltaZ > threshold)
    ) {
      // calculate time in milliseconds since last shake registered
      let timeDifference = Date.now() - this.lastTime;

      if (timeDifference > timeout) {
        this.options.handler();
        this.lastTime = Date.now();
      }
    }

    this.lastX = x;
    this.lastY = y;
    this.lastZ = z;
  }

  // event handler
  handleEvent(event) {
    if (typeof this[event.type] === "function") {
      return this[event.type](event);
    }
  }
}
