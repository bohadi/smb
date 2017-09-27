const BABYLON = require('../cdn/babylon.js');

const PL = require('./pointerLock.js');
const UTIL = require('./util.js');

//TODO refactor player and item management out
//PLAYER STATE
exports.getP1 = function() {return p1}
var p1 = {
  weaponDrawn  : false, //can attack
  castingMode  : false, //can use magic
  socialMode   : false, //interact with beings
  handMode     : false, //interact with objects
  isSprinting  : false,
  isRunning    : true,
  isSneaking   : false,
  isSwimming   : false,
  isFlying     : false,
  canJump      : true,
  walkSpeed          : 0.9,   //default 2
  walkInertia        : 0.36,  //default 0.9
  walkAngSens        : 1000,  //default 2000, lower faster rotation
  runSpeed           : 1.2,   
  runInertia         : 0.65, 
  runAngSens         : 1200, 
  sprintSpeed        : 1.5,
  sprintInertia      : 0.72,
  sprintAngSens      : 1300,  
  body : {
    head  : null,
    lHand : null,
    rHand : null,
    chest : null,
    lFoot : null,
    rFoot : null,
  },
  is2HStance : false,
  equip : {
    lHand   : null,
    rHand   : null,
    head    : null,
    chest   : null,
    arms    : null,
    legs    : null,
    feet    : null,
  },
  inventory : [],
}

//TODO this isnt very neat
var hitboxFns = [];

//TODO actual gravity acceleration use CANNON
var _initJumpAnim = function(scene, camera) {
  var animation = new BABYLON.Animation("jump", "position.y", 30,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  var keys = [
    //TODO without recreating the anim each jump, this saves the first y position...
    { frame:  0, value: camera.position.y },
    { frame: 10, value: camera.position.y + 3 },
    //{ frame: 20, value: camera.position.y }
  ];
  animation.setKeys(keys);
  var easefn = new BABYLON.SineEase();
  easefn.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
  animation.setEasingFunction(easefn);
  animation.addEvent(new BABYLON.AnimationEvent(0, function() {
    p1.canJump = false;
  }))
  animation.addEvent(new BABYLON.AnimationEvent(5, function() {
    //play jump sound
    console.log('jumpsound');
  }))
  animation.addEvent(new BABYLON.AnimationEvent(10, function() {
    p1.canJump = true;
    console.log('canjump');
    //TODO what if we land on a higher plane
  }))
  return animation;
}
//TODO if walk off ground and did not jump, use jump anyway...
var _jump = function (scene, camera) {
  //TODO how to reference specific animation?
  camera.animations.push(_initJumpAnim(scene, camera));
  scene.beginAnimation(camera, 0, 20);
  camera.animations.pop();
} 
var _initP1Animations = function(scene, camera) {
  //camera.animations.push(_initJumpAnim(scene, camera));
  //TODO p1 state change anims
  //TODO toggleSheath animations
}

var _intoInventory = function(item) {
  p1.inventory.push(item);
  //TODO item pickup sound, update gui
}

var _setWeaponHitbox = function(weapon, hitbox) {
  //TODO only quickly register and unregister during attack swing animation
  var hitboxFn = function () {
    if (weapon.intersectsMesh(p1.body[hitbox], true)) {
      p1.body[hitbox].material.emissiveColor = new BABYLON.Color4(1, 0, 0, 1);
    } else {
      p1.body[hitbox].material.emissiveColor = new BABYLON.Color4(0, 0, 0, 1);
      //TODO on sheathe the color is not returned
    }
  }
  weapon.registerBeforeRender(hitboxFn);
  return hitboxFn;
}
var _unsetWeaponHitbox = function(weapon) {
  hitboxFns.forEach(function(fn) {
    weapon.unregisterBeforeRender(fn);
  })
  console.log(hitboxFns.length);
  hitboxFns = [];
}

var _equip = function (slot, item) {
  //TODO stat changes, sound, animation, etc
  p1.equip[slot] = item;
  item.parent = p1.body[slot];
  if (slot == 'lHand') {
    item.position.x =  0.1;
    item.position.y =  0.5;
    item.position.z =  1.2;
    item.rotation.x = UTIL.deg2rad(-30);
    item.rotation.y = UTIL.deg2rad(10);
  } else if (slot == 'rHand') {
    item.position.x = -0.1;
    item.position.y =  0.5;
    item.position.z =  1.2;
    item.rotation.x = UTIL.deg2rad(-30);
    item.rotation.y = UTIL.deg2rad(-10);
  } else if (slot == 'head' ) {
  } else if (slot == 'chest' ) {
  } else if (slot == 'arms' ) {
  } else if (slot == 'legs' ) {
  } else if (slot == 'feet' ) {
  }
}
var _unsheatheWeapon = function() {
  p1.body.lHand.setEnabled(true);
  p1.body.rHand.setEnabled(true);
  //we need to unregisterbeforerender these on sheathe
  var hitHead = _setWeaponHitbox(p1.equip.lHand, 'head');
  var hitChest = _setWeaponHitbox(p1.equip.lHand, 'chest');
  hitboxFns.push(hitHead);
  hitboxFns.push(hitChest);
  //p1.body.lHand.collisionMask = 1; //TODO only hitbox collisions, ground bug...
  //TODO sheathe animation and sound
}
var _sheatheWeapon = function() {
  p1.body.lHand.setEnabled(false);
  p1.body.rHand.setEnabled(false);
  //TODO after attack anim
  //_unsetWeaponHitbox(p1.equip.lHand);
  //TODO sheathe animation and sound
}
var _toggleSheath = function() {
  p1.weaponDrawn = !p1.weaponDrawn;
  if (p1.weaponDrawn)
       { _unsheatheWeapon() }
  else { _sheatheWeapon() }
}

var _initIntersect = function(scene) {
}

var _initBody = function(scene, camera) {
  //TODO move character mesh directly
  //chest
  p1.body.chest = BABYLON.MeshBuilder.CreateBox('chest', {width: 0.9, height: 1.4, depth: 0.5}, scene);
  p1.body.chest.position.z = -10;
  p1.body.chest.position.y = 2.7;
  p1.body.chest.material = new BABYLON.StandardMaterial('chestMat', scene);
  //head
  p1.body.head = BABYLON.MeshBuilder.CreateBox('head', {width: 0.5, height: 0.5, depth: 0.5}, scene);
  p1.body.head.parent = p1.body.chest;
  p1.body.head.position.y = 1.3;
  p1.body.head.material = new BABYLON.StandardMaterial('headMat', scene);
  //hands
  p1.body.lHand = BABYLON.MeshBuilder.CreateBox('lHand', {width: 0.1, height: 0.1, depth: 0.1}, scene);
  //p1.body.lHand.parent = p1.body.chest;
  p1.body.lHand.parent = camera;
  p1.body.lHand.position.x = -0.5;
  p1.body.lHand.position.y = -0.5;
  p1.body.lHand.position.z =  1.0;
  p1.body.rHand = BABYLON.MeshBuilder.CreateBox('rHand', {width: 0.1, height: 0.1, depth: 0.1}, scene);
  //p1.body.rHand.parent = p1.body.chest;
  p1.body.rHand.parent = camera;
  p1.body.rHand.position.x =  0.5;
  p1.body.rHand.position.y = -0.5;
  p1.body.rHand.position.z =  1.0;
  //feet
  p1.body.lFoot = BABYLON.MeshBuilder.CreateBox('lFoot', {width: 0.2, height: 0.1, depth: 0.4}, scene);
  p1.body.lFoot.parent = p1.body.chest;
  p1.body.lFoot.position.x = -0.5;
  p1.body.lFoot.position.y = -2.0;
  p1.body.lFoot.position.z =  0.2;
  p1.body.rFoot = BABYLON.MeshBuilder.CreateBox('rFoot', {width: 0.2, height: 0.1, depth: 0.4}, scene);
  p1.body.rFoot.parent = p1.body.chest;
  p1.body.rFoot.position.x =  0.5;
  p1.body.rFoot.position.y = -2.0;
  p1.body.rFoot.position.z =  0.2;
}

var _initCharacter = function(scene, camera) {
  _initBody(scene, camera);
  p1.body.lHand.setEnabled(p1.weaponDrawn);
  p1.body.rHand.setEnabled(p1.weaponDrawn);

  var sword = BABYLON.MeshBuilder.CreateBox('sword', {width: 0.05, height: 0.2, depth: 2.5}, scene);
  _intoInventory(sword); 
  //TODO 2h stance
  p1.is2HStance = true;
  _equip('lHand', sword);
}

var _setRunOrWalkSpeed = function(camera) {
  if (p1.isRunning) { 
    camera.speed              = p1.runSpeed;
    camera.inertia            = p1.runInertia;
    camera.angularSensibility = p1.runAngSens;
  } else {
    camera.speed              = p1.walkSpeed;
    camera.inertia            = p1.walkInertia;
    camera.angularSensibility = p1.walkAngSens;
}}

var _initControlsKBM = function (scene, camera) {
  //TODO attach camera to body
  camera.keysUp    = [87]; //w 87
  camera.keysLeft  = [65]; //a 65
  camera.keysDown  = [83]; //s 83
  camera.keysRight = [68]; //d 68
  //jump, sprint, walk, sneak, un/sheath, interact, cast
  scene.actionManager = new BABYLON.ActionManager(scene);
  scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
      evt.sourceEvent.preventDefault();
      //evt.sourceEvent.stopPropagation();   //interferes with fullscreen
      switch (evt.sourceEvent.keyCode) {
        case 32: //spacebar jump
          //TODO can double jump
          if (p1.canJump) {
            _jump(scene, camera);
            //p1.canJump = false;
          }
          break;
        case 16: //shift hold to sprint
          //TODO gradually accelerate from walk/run to sprint speed
          camera.speed   = p1.sprintSpeed;
          camera.inertia = p1.sprintInertia;
          p1.isSprinting = true;
          break;
        case 67: //c toggle sneak
          p1.isSneaking  = !p1.isSneaking;
          break;
        case 82: //r weapon drawn / sheath -> lmb/rmb unlock cursor for combat maneuver
          _toggleSheath();
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
      //evt.sourceEvent.preventDefault();
      //evt.sourceEvent.stopPropagation();
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
  //TODO gamepad (and touch and vr) controls
  camera.speed              =   p1.runSpeed;  
  camera.inertia            =   p1.runInertia;
  camera.angularSensibility =   p1.runAngSens;
  camera.onCollide = function (collidedMesh) {
    //TODO take dmg etc
    //console.log(collidedMesh.name);
  }
  //cannot fly
  camera._updatePosition = function() {
    //TODO move forward/backward even when looking down or up...
    this.cameraDirection.y = 0;
    //TODO except don't zero when swimming/flying
    this._collideWithWorld(this.cameraDirection);
    if (!this.checkCollisions) {
      this.super._updatePosition();
    }
  }
}

var _initCollisionGravity = function (scene, camera) {
  scene.gravity = new BABYLON.Vector3(0, -0.3, 0); //-9.81
  camera.applyGravity = true;
  camera.ellipsoid = new BABYLON.Vector3(0.5, 2, 0.5); //default 0.5, 1, 0.5
  camera.position.y = 4; // match collision ellipsoid
  camera.checkCollisions = true;
  camera._needMoveForGravity = true;
  scene.collisionsEnabled = true;
  //scene.workerCollisions = true;
}

//camera and controls
exports.setupCameraAndControls = function(canvas, scene) {
  var camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(1,2,-20), scene);
  camera.setTarget(new BABYLON.Vector3(1,2,0));
  camera.fov  = 1.1;  //default 0.8, 1 radian ≈ 57.3°
  camera.minZ = 0;    //default 1
  camera.attachControl(canvas, false);
  _initControls(scene, camera);
  _initCollisionGravity(scene, camera);
  _initCharacter(scene, camera);
  //_initP1Animations(scene, camera);
  return camera;
}

