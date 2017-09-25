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

var p1 = {
  weaponDrawn  : false, //can attack
  castingMode  : false, //can use magic
  socialMode   : false, //interact with beings
  handMode     : false, //interact with objects
	isSprinting  : false,
	isRunning    : false,
  isSneaking   : false,
  isSwimming   : false,
  canJumpAgain : true,
}

var _initControlsKBM = function (scene, camera) {
  camera.keysUp    = [87]; //w 87
  camera.keysLeft  = [65]; //a 65
  camera.keysDown  = [83]; //s 83
  camera.keysRight = [68]; //d 68
  //jump, sprint, walk, sneak, un/sheath, interact, cast
  scene.actionManager = new BABYLON.ActionManager(scene);
  scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
      switch (evt.sourceEvent.keyCode) {
        case 32: //spacebar jump
          if (p1.canJumpAgain) {
            camera.position.y += 2;
            console.log('jumped');
          }
          //p1.canJumpAgain = false;
          break;
        case 16: //shift hold to sprint
          camera.speed   += 0.5;
          camera.inertia += 0.05;
          p1.isSprinting = true;
          break;
        case 17: //ctrl toggle sneak
          p1.isSneaking  = true;
          break;
        case 18: //alt toggle run/walk
          p1.isRunning   = true;
          break;
        case 82: //r weapon drawn / sheath -> lmb/rmb unlock cursor for combat maneuver
          p1.weaponDrawn = true;
          break;
        case 69: //e interaction mode -> lmb pick objects / rmb unlock cursor for social emote
          p1.socialMode  = true;
          p1.handMode    = true;
          break;
        case 70: //f casting mode -> lmb/rmb unlock cursor for spell gesture
          p1.castingMode = true;
          break;
  }}));
  scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
      switch (evt.sourceEvent.keyCode) {
        case 16: //shift hold to sprint
          camera.speed   -= 0.5;
          camera.inertia -= 0.05;
          p1.isSprinting = false;
          break;
  }}));
}

var _initControls = function (scene, camera) {
  _initControlsKBM(scene, camera);
  camera.speed              =   1.0;  //default 2
  camera.inertia            =   0.75; //default 0.9
  camera.angularSensibility = 750.0;  //default 2000, lower faster
}

var _initCollisionGravity = function (scene, camera) {
  scene.gravity = new BABYLON.Vector3(0, -0.3, 0); //-9.81
  camera.applyGravity = true;
  camera.ellipsoid = new BABYLON.Vector3(1, 2, 1); //default 0.5, 1, 0.5
  camera.position.y = 4; // match collision ellipsoid
  scene.collisionsEnabled = true;
  //scene.workerCollisions = true;
  camera.checkCollisions = true;
}

//camera and controls
exports.setupCameraAndControls = function(canvas, scene) {
  var camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0,5,-10), scene);
  camera.fov  = 1.1;  //default 0.8, 1 radian ≈ 57.3°
  camera.minZ = 0;    //default 1
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, false);
  _initControls(scene, camera);
  _initPointerLock(canvas, camera);
  _initCollisionGravity(scene, camera);
  return camera;
}

