const BABYLON = require('../cdn/babylon.js');

//pointerlock
var _initPointerLock = function(canvas, camera) {
  var isPointerLocked = false;
  canvas.addEventListener("click", function (evt) {
    if (!isPointerLocked) {
      canvas.requestPointerLock = canvas.requestPointerLock
        || canvas.msRequestPointerLock
        || canvas.mozRequestPointerLock
        || canvas.webkitRequestPointerLock;
      if (canvas.requestPointerLock) {
        canvas.requestPointerLock();
      }
    }
  }, false);
  var pointerLockChange = function (event) {
    var controlEnabled = (
      document.mozPointerLockElement === canvas
      || document.webkitPointerLockElement === canvas
      || document.msPointerLockElement === canvas
      || document.pointerLockElement === canvas);
    if (!controlEnabled) {
      camera.detachControl(canvas);
    } else {
      camera.attachControl(canvas);
    }
  };
  document.addEventListener("pointerLockChange", pointerLockChange, false);
  document.addEventListener("mspointerLockChange", pointerLockChange, false);
  document.addEventListener("mozpointerLockChange", pointerLockChange, false);
  document.addEventListener("webkitpointerLockChange", pointerLockChange, false);
}

var _initControls = function (camera) {
  camera.keysUp    = [87]; //w
  camera.keysLeft  = [65]; //a
  camera.keysDown  = [83]; //s
  camera.keysRight = [68]; //d
  camera.speed   =   1; //default 2
  camera.inertia = 0.9; //default 0.9
  camera.fov     = 0.8; //default 0.8
  //camera.applyGravity    = true;
  camera.checkCollisions = true;
}

//camera and controls
exports.setupCameraAndControls = function(canvas, scene) {
  var camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0,5,-10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, false);
  _initControls(camera);
  _initPointerLock(canvas, camera);
  return camera;
}

