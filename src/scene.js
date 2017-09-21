const PEP     = require('../cdn/pep.min.js');
const CANNON  = require('../cdn/cannon.min.js');
const BABYLON = require('../cdn/babylon.js');

const CC = require('./cameraControls.js');


var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas, true);
var scene = new BABYLON.Scene(engine);
var camera = CC.setupCameraAndControls(canvas, scene);

console.log(camera.minZ);
console.log(camera.maxZ);

var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
sphere.position.y = 10;
sphere.convertToFlatShadedMesh();
var ground = BABYLON.Mesh.CreateGround('ground1', 60, 60, 2, scene);

//render the scene and post-setup
window.addEventListener('DOMContentLoaded', function() {
  engine.runRenderLoop(function() {
    scene.render();
  });
  //fps counter
  var fps = document.getElementById('fps');
  fps.innerHTML = engine.getFps().toFixed(1) + ' fps';
  //resize
  window.addEventListener('resize', function() {
    engine.resize();
  });
});

