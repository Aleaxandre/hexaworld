import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3, Color3, Vector2 } from "@babylonjs/core/Maths/math";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";

import { GridMaterial } from "@babylonjs/materials/grid";
//import "@babylonjs/core/Materials/standardMaterial";

// Required side effects to populate the Create methods on the mesh class. Without this, the bundle would be smaller but the createXXX methods from mesh would not be accessible.
import "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { HexTilesGrid } from "./tiles/HexTilesGrid";
import { HexTileMesh } from "./tiles/HexTileMesh";

// Get the canvas element from the DOM.
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

// Associate a Babylon Engine to it.
const engine = new Engine(canvas);

// Create our first scene.
var scene = new Scene(engine);

// This creates and positions a free camera (non-mesh)
var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

// This targets the camera to scene origin
camera.setTarget(Vector3.Zero());

// This attaches the camera to the canvas
camera.attachControl(canvas, true);

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
var light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

// Default intensity is 1. Let's dim the light a small amount
light.intensity = 0.7;

// Create a grid material
var material = new GridMaterial("grid", scene);

var ballMaterial = new StandardMaterial("BallMat", scene);
ballMaterial.diffuseColor = new Color3(0.8, 0.5, 0.3);

// Our built-in 'sphere' shape. Params: name, subdivs, size, scene
var sphere = Mesh.CreateSphere("sphere1", 16, 2, scene);

// Move the sphere upward 1/2 its height
sphere.position.y = 5;

// Affect a material
sphere.material = ballMaterial;

// Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
var ground = Mesh.CreateGround("ground1", 16, 16, 16, scene);

// Affect a material
ground.material = material;


const tilesGrid:HexTilesGrid = new HexTilesGrid();
tilesGrid.generate(scene);

var onClickHandler = function (event:MouseEvent) {
    var pick = scene.pick(event.clientX, event.clientY);
    console.log(pick.pickedMesh + "["+event.clientX+"-"+event.clientY+"]");

	if (pick.pickedMesh && (<HexTileMesh>pick.pickedMesh).hexPosition) {
		var hexagon = pick.pickedMesh;
		console.log((<HexTileMesh>hexagon).hexPosition);
	}
};

document.body.addEventListener("pointerdown", onClickHandler, false);

// Render every frame
engine.runRenderLoop(() => {
    scene.render();
});