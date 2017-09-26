const BABYLON = require('../cdn/babylon.js');

const PL = require('./pointerLock.js');

//PLAYER STATE
var p1 = {
  weaponDrawn  : false, //can attack
  castingMode  : false, //can use magic
  socialMode   : false, //interact with beings
  handMode     : false, //interact with objects
  isSprinting  : false,
  isRunning    : true,
  isSneaking   : false,
  isSwimming   : false,
  canJumpAgain : true,
  walkSpeed          : 0.7,
  walkInertia        : 0.10,
  runSpeed           : 1.0,         //default 2
  runInertia         : 0.65,        //default 0.9
  sprintSpeed        : 1.5,
  sprintInertia      : 0.70,
  angularSensibility : 1200,  //default 2000, lower faster
}

var _initJumpAnim = function(scene, camera) {
  var animation = new BABYLON.Animation("jump", "position.y", 30,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  var keys = [
    { frame:  0, value: camera.position.y },
    { frame: 15, value: camera.position.y + 3 },
    { frame: 30, value: camera.position.y }
  ];
  animation.setKeys(keys);
  var easefn = new BABYLON.SineEase();
  easefn.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
  animation.setEasingFunction(easefn);
  animation.addEvent(new BABYLON.AnimationEvent(5, function() {
    //play jump sound
    console.log('jumpsound');
  }))
  return animation;
}

var _initP1Animations = function(scene, camera) {
  camera.animations.push(_initJumpAnim(scene, camera));
  //TODO p1 state change anims
  //camera.animations.push(_initJumpAnim(scene, camera));
}

//TODO if off ground and did not jump, use jump...
var _jump = function (scene, camera) {
  //TODO how to reference specific animation?
  scene.beginAnimation(camera, 0, 30, false, 2);
} 

var _setRunOrWalkSpeed = function(camera) {
  if (p1.isRunning) { 
    camera.speed   = p1.runSpeed;
    camera.inertia = p1.runInertia;
  } else {
    camera.speed   = p1.walkSpeed;
    camera.inertia = p1.walkInertia;
}}

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
          //TODO can double jump
          if (p1.canJumpAgain) {
            _jump(scene, camera);
            p1.canJumpAgain = false;
          }
          break;
        case 16: //shift hold to sprint
          camera.speed   = p1.sprintSpeed;
          camera.inertia = p1.sprintInertia;
          p1.isSprinting = true;
          break;
        case 17: //ctrl toggle sneak
          p1.isSneaking  = !p1.isSneaking;
          break;
        case 82: //r weapon drawn / sheath -> lmb/rmb unlock cursor for combat maneuver
          p1.weaponDrawn = !p1.weaponDrawn;
          //TODO some animation
          console.log('weapon: '+p1.weaponDrawn);
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
        case 16: //shift up, stop sprinting
          p1.isSprinting = false;
          _setRunOrWalkSpeed(camera);
          break;
        case 18: //alt toggle run/walk
          //TODO alt breaks pointerlock when not in fullscreen
          p1.isRunning = !p1.isRunning;
          _setRunOrWalkSpeed(camera);
          break;
  }}));
}

var _initControls = function (scene, camera) {
  _initControlsKBM(scene, camera);
  camera.speed              =   p1.runSpeed;  
  camera.inertia            =   p1.runInertia;
  camera.angularSensibility =   p1.angularSensibility;
  camera.onCollide = function (collidedMesh) {
    if (collidedMesh.jumpable) {
      p1.canJumpAgain = true;
  }}
  //cannot fly
  camera._updatePosition = function() {
    this.cameraDirection.y = 0;
    this._collideWithWorld(this.cameraDirection);
    if (!this.checkCollisions) {
      this.super._updatePosition();
    }
  }
}

var _initCollisionGravity = function (scene, camera) {
  scene.gravity = new BABYLON.Vector3(0, -0.3, 0); //-9.81
  camera.applyGravity = true;
  camera.ellipsoid = new BABYLON.Vector3(1, 2, 1); //default 0.5, 1, 0.5
  camera.position.y = 4; // match collision ellipsoid
  scene.collisionsEnabled = true;
  //scene.workerCollisions = true;
  camera.checkCollisions = true;
  camera._needMoveForGravity = true;
}

//camera and controls
exports.setupCameraAndControls = function(canvas, scene) {
  var camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(1,2,-20), scene);
  camera.setTarget(new BABYLON.Vector3(1,2,0));
  camera.fov  = 1.1;  //default 0.8, 1 radian ≈ 57.3°
  camera.minZ = 0;    //default 1
  camera.attachControl(canvas, false);
  _initControls(scene, camera);
  PL._initPointerLock(canvas, camera);
  _initCollisionGravity(scene, camera);
  _initP1Animations(scene, camera);
  return camera;
}

