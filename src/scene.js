//include scripts in index.html
//const PEP     = require('../cdn/pep.min.js');
//const CANNON  = require('../cdn/cannon.min.js');
//const BABYLON = require('../cdn/babylon.js');
//const STATS = require('../cdn/stats.min.js');

const UTIL = require('./util.js');

const CC = require('./cameraControls.js');
const PL = require('./pointerLock.js');

var p1 = CC.getP1();

var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas);
var scene = new BABYLON.Scene(engine);
//scene.debugLayer.show();

engine.renderEvenInBackground = false;

//TODO seems this can work now
//var gravity = new BABYLON.Vector3(0,-0.5,0);
//var physicsPlugin = new BABYLON.CannonJSPlugin();
//scene.enablePhysics(gravity, physicsPlugin);
//console.log(scene.isPhysicsEnabled());

//camera and controls
var camera = CC.setupCameraAndControls(canvas, scene);

PL.initPointerLock(canvas);

//TODO this is an aggressive hack
 var maxWindow = function maximize() {
    //window.moveTo(0, 0);
    //window.resizeTo(screen.width, screen.height);
    engine.setSize(screen.width, screen.height);
}
var isFullScreen = false;
var onFullScreenChange = function () {
  if 	    (document.fullscreen !== undefined)         isFullScreen = document.fullscreen;
  else if (document.mozFullScreen !== undefined)      isFullScreen = document.mozFullScreen;
  else if (document.webkitIsFullScreen !== undefined) isFullScreen = document.webkitIsFullScreen;
  else if (document.msIsFullScreen !== undefined)     isFullScreen = document.msIsFullScreen;
}
document.addEventListener("fullscreenchange",  	    onFullScreenChange, false);
document.addEventListener("mozfullscreenchange", 	  onFullScreenChange, false);
document.addEventListener("webkitfullscreenchange", onFullScreenChange, false);
document.addEventListener("msfullscreenchange", 	  onFullScreenChange, false);
var switchFullscreen = function () {
  engine.switchFullscreen(true);
  //if (isFullScreen) BABYLON.Tools.ExitFullscreen();
  //else BABYLON.Tools.RequestFullscreen(canvas);
};
//TODO doesn't resize
//TODO when fullscreen and walking cannot pointerlock right... window resize problem
//TODO removes fps element
document.addEventListener("keydown", function (evt) {
  //if (evt.ctrlKey && evt.shiftKey && evt.keyCode == '70') { //ctl shft f
  if (evt.keyCode == '113') { //f2
    //switchFullscreen();
    //PL._initPointerLock(canvas, null);
    //maxWindow();
    engine.switchFullscreen(true);
    //engine.resize();
  };
}, false);
//=======================================================================================

//skybox
scene.createDefaultSkybox(new BABYLON.CubeTexture('./img/skybox/desert', scene), false, 10000);
//scene.createDefaultSkybox(new BABYLON.CubeTexture('./img/skybox/mtn', scene));

//=======================================================================================
//lighting
var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.5;
var spotlight = new BABYLON.SpotLight('spotlight',
  new BABYLON.Vector3(19, 17, 15), new BABYLON.Vector3(-.6, -1, -.3), 1.4, 1, scene);
spotlight.diffuse = BABYLON.Color3.White();
var lamp = new BABYLON.MeshBuilder.CreateCylinder('lamp', {diameter:5}, scene);
lamp.material = new BABYLON.StandardMaterial('lampcolor', scene);
lamp.material.diffuseColor = BABYLON.Color3.Random();
lamp.position.x = 20;
lamp.position.y = 16;
lamp.position.z = 15;
lamp.rotation.x = UTIL.deg2rad(64);
lamp.rotation.y = UTIL.deg2rad(57);
//lamp.rotation.z = UTIL.deg2rad(15);
//=======================================================================================

//TODO volumetric light 'godrays'

//=======================================================================================

//fog
scene.fogColor = new BABYLON.Color3(0.5, 0.3, 0.0);
//scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
//scene.fogStart = 10;
//scene.fogEnd = 40;
scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
x = 0;
holdframes = 0;
scene.registerBeforeRender(function() {
  scene.fogDensity = Math.max(.05 * Math.sin(x) + .05,
  .09 * Math.sin(x/0.6  + .1) +
  .05 * Math.sin(x/1.2  + .2) +
  .04 * Math.sin(x/0.2  + .3) +
  .07 * Math.sin(x/3.0  + .5));
  x += 0.01;
});

//=======================================================================================
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
lathe.position.y = 0;
lathe.position.x = -2;
lathe.convertToFlatShadedMesh();

var ground = BABYLON.MeshBuilder.CreateGround('ground1',
  {width:60, height:60, subdivisions:4}, scene);

var platform1 = BABYLON.MeshBuilder.CreateBox('platform1',
  {width:3, height:1, depth:3}, scene);
platform1.position.x = 15;
platform1.position.y = 2;
platform1.position.z = 3;
var platform2 = BABYLON.MeshBuilder.CreateBox('platform2',
  {width:3, height:1, depth:3}, scene);
platform2.position.x = 15;
platform2.position.y = 4;
platform2.position.z = 6;
var platform3 = BABYLON.MeshBuilder.CreateBox('platform3',
  {width:3, height:1, depth:3}, scene);
platform3.position.x = 15;
platform3.position.y = 6;
platform3.position.z = 9;

p1.body.head.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
platform1.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;
platform2.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Z;
platform3.billboardMode = BABYLON.Mesh.BILLBOARDMODE_X;

var fountain = BABYLON.MeshBuilder.CreateLathe('fountain', {shape: [
  new BABYLON.Vector3(0,0,0),
  new BABYLON.Vector3(2,0,0),
  new BABYLON.Vector3(.4,.8,0),
  new BABYLON.Vector3(.4,1,0),
  new BABYLON.Vector3(4,1.6,0),
  new BABYLON.Vector3(.3,1.6,0),
  new BABYLON.Vector3(.4,3.6,0),
  new BABYLON.Vector3(.3,4,0),
  new BABYLON.Vector3(0,4,0),
]})
fountain.position.x = -13;
fountain.position.y = 0;
fountain.position.z = 13;
fountain.convertToFlatShadedMesh();
//=======================================================================================

//collision
sphere1.checkCollisions = true;
sphere2.checkCollisions = true;
sphere3.checkCollisions = true;
sphere4.checkCollisions = true;
lathe.checkCollisions   = true;
ground.checkCollisions  = true;
platform1.checkCollisions  = true;
platform2.checkCollisions  = true;
platform3.checkCollisions  = true;
fountain.checkCollisions = true;
p1.body.head.checkCollisions = true;
p1.body.chest.checkCollisions = true;
p1.body.lFoot.checkCollisions = true;
p1.body.rFoot.checkCollisions = true;

//=======================================================================================
//shadows
var shadowGenerator = new BABYLON.ShadowGenerator(512, spotlight);
shadowGenerator.getShadowMap().renderList.push(platform1);
shadowGenerator.getShadowMap().renderList.push(platform2);
shadowGenerator.getShadowMap().renderList.push(platform3);
shadowGenerator.getShadowMap().renderList.push(sphere4);
shadowGenerator.getShadowMap().renderList.push(sphere3);
shadowGenerator.getShadowMap().renderList.push(sphere2);
shadowGenerator.getShadowMap().renderList.push(sphere1);
shadowGenerator.getShadowMap().renderList.push(fountain);
shadowGenerator.getShadowMap().renderList.push(p1.body.head);
shadowGenerator.getShadowMap().renderList.push(p1.body.chest);
shadowGenerator.getShadowMap().renderList.push(p1.body.lFoot);
shadowGenerator.getShadowMap().renderList.push(p1.body.rFoot);
shadowGenerator.getShadowMap().renderList.push(p1.equip.lHand);
platform1.receiveShadows = true;
platform2.receiveShadows = true;
platform3.receiveShadows = true;
sphere1.receiveShadows = true;
sphere2.receiveShadows = true;
sphere3.receiveShadows = true;
sphere4.receiveShadows = true;
fountain.receiveShadows = true;
p1.body.head.receiveShadows = true;
p1.body.chest.receiveShadows = true;
p1.body.lFoot.receiveShadows = true;
p1.body.rFoot.receiveShadows = true;
p1.equip.lHand.receiveShadows = true;
ground.receiveShadows = true;
//shadowGenerator.forceBackFacesOnly = true;
//soften shadows
//shadowGenerator.usePoissonSampling = true;
//shadowGenerator.useBlurExponentialShadowMap = true;
shadowGenerator.useKernelBlur = true;
shadowGenerator.blurKernel = 32;
//shadowGenerator.useCloseExponentialShadowMap = true;
shadowGenerator.useBlurCloseExponentialShadowMap = true;
spotlight.shadowMinZ= 10;
spotlight.shadowMaxZ= 30;
//shadowGenerator.frustumEdgeFalloff = 1.0;
//=======================================================================================

//=======================================================================================
//materials
ground.material = new BABYLON.StandardMaterial('grass', scene);
ground.material.diffuseTexture = new BABYLON.Texture('./img/grass.png', scene);
ground.material.diffuseTexture.uScale = 10.0;
ground.material.diffuseTexture.vScale = 10.0;
ground.material.specularColor = new BABYLON.Color3(0,0,0);
sphere4.material = new BABYLON.StandardMaterial('rainbow', scene);
sphere4.material.diffuseTexture = new BABYLON.Texture('./img/rainbow.jpg', scene);
fountain.material = new BABYLON.StandardMaterial('fountain', scene);
fountain.material.diffuseTexture = new BABYLON.Texture('./img/stone.jpg', scene);

//particles - note, if transparency/alpha in scene -> mesh-based solid particle sys
var ps1 = new BABYLON.ParticleSystem('ps1', 2000, scene);
ps1.particleTexture = new BABYLON.Texture('img/alphaparticle.png', scene);
//ps2.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
ps1.textureMask = new BABYLON.Color4(0.1, 0.8, 0.8, 1.0);
ps1.emitter = lathe;
ps1.minEmitBox = new BABYLON.Vector3(-.5,1,-.5); //-0.5 defaults
ps1.maxEmitBox = new BABYLON.Vector3(.5,1.5,.5); // 0.5 defaults
ps1.start();
var ps2 = new BABYLON.ParticleSystem('ps2', 2000, scene);
ps2.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
ps2.particleTexture = new BABYLON.Texture('img/smoke.png', scene);
//TODO jk, got it, black smoke... hooray
ps2.textureMask = new BABYLON.Color4(1.0, 1.0, 1.0, 1.0);
//ps2.color1 = new BABYLON.Color4(1.0, 1.0, 1.0, 1.0);
//ps2.color2 = new BABYLON.Color4(1.0, 1.0, 1.0, 1.0);
ps2.emitter = lathe;
ps2.minEmitBox = new BABYLON.Vector3(-.6,3,-.6); //-0.5 defaults
ps2.maxEmitBox = new BABYLON.Vector3(.6,3.5,.6); // 0.5 defaults
ps2.start();
var ps3 = new BABYLON.ParticleSystem('ps3', 2000, scene);
ps3.particleTexture = new BABYLON.Texture('img/particle.png', scene);
ps3.textureMask = new BABYLON.Color4(1.0, 1.0, 1.0, 0.0);
ps3.color1 = new BABYLON.Color4(0.0, 0.2, 1.0, 1.0);
ps3.color2 = new BABYLON.Color4(0.1, 0.3, 1.0, 1.0);
ps3.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
ps3.emitter = fountain;
ps3.minEmitBox = new BABYLON.Vector3(-.5,2,-.5); //-0.5 defaults
ps3.maxEmitBox = new BABYLON.Vector3(.5,4,.5); // 0.5 defaults
ps3.minSize = 0.05; //1 default
ps3.maxSize = 1;   //1 default
ps3.minLifeTime = 0.5; //1 default
ps3.maxLifeTime = 1.5; //1 default
ps3.emitRate = 500; //10 default
ps3.gravity = new BABYLON.Vector3(0, -9, 0);
ps3.direction1 = new BABYLON.Vector3(-3, 3,  3);
ps3.direction2 = new BABYLON.Vector3( 3, 5, -3);
ps3.updateSpeed = 0.013; //.01 default, higher -> faster animation
//ps3.targetStopDuration = 10;
ps3.start();
//=======================================================================================

//=======================================================================================
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
//=======================================================================================

//=======================================================================================
//sprites
//TODO sprites do not cast shadows or receive light (ie. whiterun field problem)
var numShrubs = 3000;
var shrubtreeSpriteManager =
  new BABYLON.SpriteManager('shrubtreeMgr', 'img/sprite_tree.png', numShrubs+1, 650, scene);
var tree = new BABYLON.Sprite('tree', shrubtreeSpriteManager);
tree.size = 20;
tree.position.y = tree.size/2 - 1;
tree.position.z = 27;
for (var i = 0; i < numShrubs; i++) {
  var shrub = new BABYLON.Sprite("tree", shrubtreeSpriteManager);
  shrub.position.x =  -30 + 60*Math.random();
  shrub.position.z =  -30 + 60*Math.random();
  shrub.size       =   .5 + .5*Math.random();
}
//=======================================================================================

//=======================================================================================
//distant valley
var distant = BABYLON.MeshBuilder.CreateGround('distant',
  {width:600, height:600, subdivisions:4}, scene);
distant.material = ground.material;
distant.position.y = -1000;
distant.position.z = 1000;
var shrubtreeSpriteManager2 =
  new BABYLON.SpriteManager('shrubtreeMgr2', 'img/sprite_tree.png', 10*numShrubs, 650, scene);
for (var i = 0; i < 10*numShrubs; i++) {
  var shrub = new BABYLON.Sprite("tree", shrubtreeSpriteManager2);
  shrub.position.y = -1000
  shrub.position.x =  -300 + 600*Math.random();
  shrub.position.z =  1000-300 + 600*Math.random();
  shrub.size       =   .5 + .5*Math.random();
}

//mouse events
scene.onPointerDown = function (pEvt, pickResult) {
  var screenWidth = canvas.offsetWidth, screenHeight = canvas.offsetHeight;
  //supply your own PointerLock variable(s)
  if(engine.isPointerLock) 
    //TODO doesnt seem to work?
    var pick = scene.pick(screenWidth / 2, screenHeight / 2);
  else
    var pick = scene.pick(scene.pointerX, scene.pointerY);
  if (pickResult.hit) {
    //TODO pick up item etc
    //console.log(engine.isPointerLock+pickResult.pickedPoint);
  }
}
//=======================================================================================

//=======================================================================================
//render the scene and post-setup
window.addEventListener('DOMContentLoaded', function() {
  var fps = document.getElementById('fps');
  var fpsStat = new Stats();
  fpsStat.showPanel( 0 ); 
  var msStat = new Stats();
  msStat.showPanel( 1 ); 
  var memStat = new Stats();
  memStat.showPanel( 2 ); 
  fpsStat.domElement.style.cssText = 'position:absolute;top:0px;left:0px;';
  msStat.domElement.style.cssText = 'position:absolute;top:0px;left:80px;';
  memStat.domElement.style.cssText = 'position:absolute;top:0px;left:160px;';
  document.body.appendChild( fpsStat.dom );
  document.body.appendChild( msStat.dom );
  document.body.appendChild( memStat.dom );
  engine.runRenderLoop(function() {
    fpsStat.begin();
    msStat.begin();
    memStat.begin();

    scene.render();

    fpsStat.end();
    msStat.end();
    memStat.end();
    fps.innerHTML = engine.getFps().toFixed(0) + ' fps';
  });
  window.addEventListener('resize', function() {
    engine.resize();
  });

}, false);

