import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { Scene } from "@babylonjs/core/scene";

export class HexTileMesh extends Mesh {
    hexPosition?: Vector3;

    static CreateHexTileMesh(name: string, scene?: Scene): HexTileMesh{
        const hexTileMesh:HexTileMesh = Mesh.CreateCylinder(name, 1, 3, 3, 6, 1, scene, false);
        return hexTileMesh;
    }
}