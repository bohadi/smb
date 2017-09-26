//include scripts in index.html
const PEP     = require('../cdn/pep.min.js');
const CANNON  = require('../cdn/cannon.min.js');
const BABYLON = require('../cdn/babylon.js');

const CC = require('./cameraControls.js');


var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas);
var scene = new BABYLON.Scene(engine);

engine.renderEvenInBackground = false;

//camera and controls
var camera = CC.setupCameraAndControls(canvas, scene);

//var gravity = new BABYLON.Vector3(0,-0.5,0);
//var physicsPlugin = new BABYLON.CannonJSPlugin();
//scene.enablePhysics(gravity, physicsPlugin);
//console.log(scene.isPhysicsEnabled());

//TODO fullscreen
var isFullScreen = false;
var onFullScreenChange = function () {
  if 	  (document.fullscreen !== undefined)         isFullScreen = document.fullscreen;
  else if (document.mozFullScreen !== undefined)      isFullScreen = document.mozFullScreen;
  else if (document.webkitIsFullScreen !== undefined) isFullScreen = document.webkitIsFullScreen;
  else if (document.msIsFullScreen !== undefined)     isFullScreen = document.msIsFullScreen;
}
var switchFullscreen = function () {
  if (isFullScreen) BABYLON.Tools.ExitFullscreen();
  else BABYLON.Tools.RequestFullscreen(canvas);
};
document.addEventListener("fullscreenchange",  	    onFullScreenChange, false);
document.addEventListener("mozfullscreenchange", 	onFullScreenChange, false);
document.addEventListener("webkitfullscreenchange", onFullScreenChange, false);
document.addEventListener("msfullscreenchange", 	onFullScreenChange, false);
canvas.onclick = switchFullscreen();

//lighting
var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

//meshes
var sphere1 = BABYLON.MeshBuilder.CreateSphere('sphere1', {segments:2, diameter:2}, scene);
sphere1.position.y = 3;
sphere1.convertToFlatShadedMesh();
var sphere2 = BABYLON.MeshBuilder.CreateSphere('sphere2', {segments:4, diameter:2}, scene);
sphere2.position.y = 3;
sphere2.position.x = 2;
sphere2.convertToFlatShadedMesh();
var sphere3 = BABYLON.MeshBuilder.CreateSphere('sphere3', {segments:8, diameter:2}, scene);
sphere3.position.y = 3;
sphere3.position.x = 4;
sphere3.convertToFlatShadedMesh();
var sphere4 = BABYLON.MeshBuilder.CreateSphere('sphere4', {segments:16, diameter:2}, scene);
sphere4.position.y = 3;
sphere4.position.x = 6;
sphere4.convertToFlatShadedMesh();
var lathe = BABYLON.MeshBuilder.CreateLathe('lathe', {shape: [
  new BABYLON.Vector3(0,0,0),
  new BABYLON.Vector3(1,.1,0),
  new BABYLON.Vector3(.5,.3,0),
  new BABYLON.Vector3(.3,.7,0),
  new BABYLON.Vector3(.7,1,0),
  new BABYLON.Vector3(0,2,0),
]})
lathe.position.y = 2;
lathe.position.x = -2;
lathe.convertToFlatShadedMesh();
var ground = BABYLON.MeshBuilder.CreateGround('ground1',
  {width:60, height:60, subdivisions:4}, scene);
sphere1.checkCollisions = true;
sphere2.checkCollisions = true;
sphere3.checkCollisions = true;
sphere4.checkCollisions = true;
lathe.checkCollisions   = true;
ground.checkCollisions  = true;
ground.jumpable = true;

//materials
ground.material = new BABYLON.StandardMaterial('grass', scene);
ground.material.diffuseTexture = new BABYLON.Texture('./img/grass.png', scene);
ground.material.diffuseTexture.uScale = 10.0;
ground.material.diffuseTexture.vScale = 10.0;
ground.material.specularColor = new BABYLON.Color3(0,0,0);
sphere4.material = new BABYLON.StandardMaterial('rainbow', scene);
sphere4.material.diffuseTexture = new BABYLON.Texture('./img/rainbow.jpg', scene);

//animations
var animationZ = new BABYLON.Animation('a1', 'rotation.z', 30,
  BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
var animationY = new BABYLON.Animation('a2', 'position.y', 30,
  BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
var animationX = new BABYLON.Animation('a3', 'scaling.x', 30,
  BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
var keys = [{ frame:   0, value:  0*Math.PI/8 }];
keys.push(  { frame:  25, value:  4*Math.PI/8 });
keys.push(  { frame:  75, value: 12*Math.PI/8 });
keys.push(  { frame: 100, value: 16*Math.PI/8 });
animationZ.setKeys(keys)
keys = [{   frame:   0, value:  3 }];
keys.push({ frame:  50, value:  6 });
keys.push({ frame: 100, value:  3 });
animationY.setKeys(keys)
var ease = new BABYLON.SineEase();
ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
animationY.setEasingFunction(ease);
keys = [{   frame:   0, value: .0 }];
keys.push({ frame:  25, value:  1 });
keys.push({ frame:  75, value:  1 });
keys.push({ frame: 100, value: .0 });
animationX.setKeys(keys)
sphere4.animations = [ animationY, animationZ ];
scene.beginAnimation(sphere4, 0, 100, true);

//sprites
var numShrubs = 3000;
var shrubtreeSpriteManager =
  new BABYLON.SpriteManager('shrubtreeMgr', 'img/sprite_tree.png', numShrubs+1, 650, scene);
var tree = new BABYLON.Sprite('tree', shrubtreeSpriteManager);
tree.size = 20;
tree.position.y = tree.size/2 - 1;
tree.position.z = 25;
for (var i = 0; i < numShrubs; i++) {
  var shrub = new BABYLON.Sprite("tree", shrubtreeSpriteManager);
  shrub.position.x =  -30 + 60*Math.random();
  shrub.position.z =  -30 + 60*Math.random();
  shrub.size       =   .5 + .5*Math.random();
}

//distant valley
var ground2 = BABYLON.MeshBuilder.CreateGround('ground2',
  {width:600, height:600, subdivisions:4}, scene);
ground2.material = ground.material;
ground2.position.y = -1000;
ground2.position.z = 1000;
var shrubtreeSpriteManager2 =
  new BABYLON.SpriteManager('shrubtreeMgr2', 'img/sprite_tree.png', 10*numShrubs, 650, scene);
for (var i = 0; i < 10*numShrubs; i++) {
  var shrub = new BABYLON.Sprite("tree", shrubtreeSpriteManager2);
  shrub.position.y = -1000
  shrub.position.x =  -300 + 600*Math.random();
  shrub.position.z =  1000-300 + 600*Math.random();
  shrub.size       =   .5 + .5*Math.random();
}

//render the scene and post-setup
window.addEventListener('DOMContentLoaded', function() {
  var fps = document.getElementById('fps');
  engine.runRenderLoop(function() {
    scene.render();
    fps.innerHTML = engine.getFps().toFixed(0) + ' fps';
  });
  window.addEventListener('resize', function() {
    engine.resize();
  });

});

