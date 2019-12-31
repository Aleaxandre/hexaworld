import { Vector3, Color3, Vector2 } from "@babylonjs/core/Maths/math";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { WaterMaterial } from '@babylonjs/materials';
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { float } from "@babylonjs/core/types";

export class HexTilesGrid {
    private width;
    private depth;
    private margin;
    private _hexWidth;
    private _hexDepth;
    private _initialPosition;

    constructor(width: number = 10, depth:number = 10, margin:float = 1.0, _hexWidth:float = 1.0, _hexDepth:float = 1.0, _initialPosition:Vector3 = Vector3.Zero()) {
        this._hexDepth = _hexDepth;
        this._hexWidth = _hexWidth;
        this._initialPosition = _initialPosition;
        this.depth = depth;
        this.width = width;
        this.margin = margin;
    }

    calculateInitialPosition = function () {
        var position = Vector3.Zero();
        position.x = -this._hexWidth * this.width / 2.0 + this._hexWidth / 2.0;
        position.z = this.depth / 2.0 * this._hexDepth / 2.0;
        return position;
    };

    getWorldCoordinate = function (x, y, z) {
        var offset = 0.0;

        if (z % 2 !== 0) {
            offset = this._hexWidth / 2.0;
        }

        var px = this._initialPosition.x + offset + x * this._hexWidth * this.margin;
        var pz = this._initialPosition.z - z * this._hexDepth * 0.75 * this.margin;

        return new Vector3(px, y, pz);
    };

    generate(scene) {
        var grid = new Mesh("Grid", scene);
        grid.isVisible = false;

        var prefab = Mesh.CreateCylinder("cylinder", 1, 3, 3, 6, 1, scene, false);
        prefab.scaling = new Vector3(3, 3, 3);
        prefab.rotation.y += Math.PI / 6;

        var boundingInfo = prefab.getBoundingInfo();
        this._hexWidth = (boundingInfo.maximum.z - boundingInfo.minimum.z) * prefab.scaling.x;
        this._hexDepth = (boundingInfo.maximum.x - boundingInfo.minimum.x) * prefab.scaling.z;
        this._initialPosition = this.calculateInitialPosition();

        // var materials = [
        //     new StandardMaterial("BlueMaterial", scene),
        //     new StandardMaterial("GreenMaterial", scene),
        //     new StandardMaterial("BrownMaterial", scene)
        // ];

        // materials[0].diffuseTexture = new Texture("Assets/images/blue.png", scene);
        // materials[1].diffuseTexture = new Texture("Assets/images/green.png", scene);
        // materials[2].diffuseTexture = new Texture("Assets/images/brown.png", scene);

        var whiteMaterial = new StandardMaterial("White", scene);
        whiteMaterial.diffuseColor = new Color3(1, 1, 1);

        var greyMaterial = new StandardMaterial("Grey", scene);
        greyMaterial.diffuseColor = new Color3(0.7, 0.5, 0.5);

        var blackMaterial = new StandardMaterial("Black", scene);
        blackMaterial.diffuseColor = new Color3(0, 0, 0);

        var greenMaterial = new StandardMaterial("Green", scene);
        greenMaterial.diffuseColor = new Color3(0.4, 1, 0.4);

        var blueMaterial = new StandardMaterial("Green", scene);
        blueMaterial.diffuseColor = new Color3(0.2, 0.5, 0.8);

        var materials = [
            greenMaterial,
            blueMaterial,
            greyMaterial,
            whiteMaterial
        ];

        var tile = null;
        var random = 0;

        for (var z = 0; z < this.depth; z++) {
            for (var x = 0; x < this.width; x++) {
                tile = prefab.clone();
                tile.position = this.getWorldCoordinate(x, 0, z);
                tile.hexPosition = new Vector3(x, 0, z);

                random = Math.floor(Math.random() * 10);

                if (random % 2 === 0) {
                    tile.scaling.y += 1;
                    tile.material = materials[0];
                }
                else if (random % 3 === 0) {
                    tile.scaling.y += 6;
                    tile.material = materials[2];
                }
                else if (random % 4 === 0) {
                    tile.scaling.y += 9;
                    tile.material = materials[3];
                }
                else {
                    tile.material = materials[1];
                }

                tile.parent = grid;
            }
        }

        prefab.dispose();
    };
}