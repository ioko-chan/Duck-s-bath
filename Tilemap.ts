import * as THREE from "three";
import * as GrassTilemapProperties from "./public/GrassTilemap.json";

class Tile {
  mesh: THREE.Mesh;
  constructor(x: number, z: number, index: number) {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const texture = new THREE.TextureLoader().load("GrassTilemap.png");
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.repeat.set(
      1 / GrassTilemapProperties.width,
      1 / GrassTilemapProperties.height,
    );
    texture.offset.set(
      (index % GrassTilemapProperties.width) / GrassTilemapProperties.width,
      Math.floor(index / GrassTilemapProperties.height) /
        GrassTilemapProperties.height,
    );
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.FrontSide,
    });
    this.mesh = new THREE.Mesh(geometry, material)
      .translateY(-0.5)
      .rotateX(-Math.PI / 2);
    this.mesh.receiveShadow = true;
    this.mesh.position.x = x + 0.5;
    this.mesh.position.z = z + 0.5;
  }
}

class Tilemap {
  constructor(scene: THREE.Scene) {
    for (const property of GrassTilemapProperties.map) {
      const tile = new Tile(property.x, property.y, property.tile);
      scene.add(tile.mesh);
    }
  }
}

export default Tilemap;
