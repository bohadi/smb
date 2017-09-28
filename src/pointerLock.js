//TODO almost obviated...

exports.getIsPointerLocked = function() {return isPointerLocked}
var isPointerLocked = false;

exports.initPointerLock = function(canvas) {
  //var isPointerLocked = false;
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
}

var _pointerLockChange = function (event) {
  isPointerLocked = (
    document.mozPointerLockElement === canvas
    || document.webkitPointerLockElement === canvas
    || document.msPointerLockElement === canvas
    || document.pointerLockElement === canvas)
}

  document.addEventListener("pointerLockChange", _pointerLockChange, false);
  document.addEventListener("mspointerLockChange", _pointerLockChange, false);
  document.addEventListener("mozpointerLockChange", _pointerLockChange, false);
  document.addEventListener("webkitpointerLockChange", _pointerLockChange, false);
