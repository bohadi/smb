const PEP     = require('../cdn/pep.min.js');
const CANNON  = require('../cdn/cannon.min.js');
const BABYLON = require('../cdn/babylon.js');

const CC = require('./cameraControls.js');


var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas, true);
var scene = new BABYLON.Scene(engine);
var camera = CC.setupCameraAndControls(canvas, scene);

console.log();

var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

var sphere1 = BABYLON.Mesh.CreateSphere('sphere1', 2, 2, scene);
sphere1.position.y = 3;
sphere1.convertToFlatShadedMesh();
var sphere2 = BABYLON.Mesh.CreateSphere('sphere2', 4, 2, scene);
sphere2.position.y = 3;
sphere2.position.x = 3;
sphere2.convertToFlatShadedMesh();
var sphere3 = BABYLON.Mesh.CreateSphere('sphere3', 8, 2, scene);
sphere3.position.y = 3;
sphere3.position.x = 6;
sphere3.convertToFlatShadedMesh();
var sphere4 = BABYLON.Mesh.CreateSphere('sphere4', 16, 2, scene);
sphere4.position.y = 3;
sphere4.position.x = 9;
sphere4.convertToFlatShadedMesh();

var ground = BABYLON.Mesh.CreateGround('ground1', 60, 60, 4, scene);
ground.material = new BABYLON.StandardMaterial('grass', scene);
ground.material.diffuseTexture = new BABYLON.Texture('./img/grass.png', scene);
ground.material.diffuseTexture.uScale = 10.0;
ground.material.diffuseTexture.vScale = 10.0;
ground.material.specularColor = new BABYLON.Color3(0,0,0);

//render the scene and post-setup
window.addEventListener('DOMContentLoaded', function() {
  var fps = document.getElementById('fps');
  engine.runRenderLoop(function() {
    scene.render();
    fps.innerHTML = engine.getFps().toFixed(0) + ' fps';
  });
  //resize
  window.addEventListener('resize', function() {
    engine.resize();
  });
});

