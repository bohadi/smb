exports._initPointerLock = function(canvas, camera) {
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
