import * as THREE from "three";

interface TileProperty {
  x: number;
  z: number;
  tile: number;
}

interface TilemapProperties {
  image: string;
  width: number;
  height: number;
  y: number;
  map: Array<TileProperty>;
}

class Tile {
  mesh: THREE.Mesh;
  constructor(
    tilemapSize: THREE.Vector2,
    position: THREE.Vector3,
    tileIndex: number,
    imageURL: string,
  ) {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const texture = new THREE.TextureLoader().load(imageURL);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.repeat.set(1 / tilemapSize.width, 1 / tilemapSize.height);
    texture.offset.set(
      (tileIndex % tilemapSize.width) / tilemapSize.width,
      Math.floor(tileIndex / tilemapSize.height) / tilemapSize.height,
    );
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.FrontSide,
    });
    this.mesh = new THREE.Mesh(geometry, material).rotateX(-Math.PI / 2);
    this.mesh.receiveShadow = true;
    const offset = new THREE.Vector3(0.5, 0, 0.5);
    this.mesh.position.copy(position).add(offset);
  }
}

class Tilemap {
  tiles: Array<Tile> = Array();
  walls: Array<THREE.Mesh> = Array();
  y: number;

  constructor(scene: THREE.Scene, properties: TilemapProperties) {
    this.y = properties.y;
    const tilemapSize = new THREE.Vector2(properties.width, properties.height);
    for (const property of properties.map) {
      const position = new THREE.Vector3(property.x, properties.y, property.z);
      const tile = new Tile(
        tilemapSize,
        position,
        property.tile,
        properties.image,
      );
      scene.add(tile.mesh);
      this.tiles.push(tile);
    }

    const wall_height = 2;
    for (let x = -10; x <= 10; x++) {
      const geometry = new THREE.PlaneGeometry(1, wall_height);
      const material = new THREE.MeshStandardMaterial({
        color: (x + 10) % 2 == 0 ? "#515151" : "#151515",
        side: THREE.FrontSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.translateZ(-10);
      mesh.position.x = x + 0.5;
      mesh.position.y = wall_height / 2 + properties.y;
      mesh.receiveShadow = true;
      scene.add(mesh);
      this.walls.push(mesh);
    }

    for (let z = -10; z <= 10; z++) {
      const geometry = new THREE.PlaneGeometry(1, wall_height);
      const material = new THREE.MeshStandardMaterial({
        color: (z + 10) % 2 == 0 ? "#515151" : "#151515",
        side: THREE.FrontSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.translateX(-10);
      mesh.rotateY(Math.PI / 2);
      mesh.position.z = z + 0.5;
      mesh.position.y = wall_height / 2 + properties.y;
      mesh.receiveShadow = true;
      scene.add(mesh);
      this.walls.push(mesh);
    }

    for (let z = -10; z <= 10; z++) {
      const geometry = new THREE.PlaneGeometry(1, wall_height);
      const material = new THREE.MeshStandardMaterial({
        color: (z + 10) % 2 == 0 ? "#515151" : "#151515",
        side: THREE.FrontSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.translateX(11);
      mesh.rotateY(-Math.PI / 2);
      mesh.position.z = z + 0.5;
      mesh.position.y = wall_height / 2 + properties.y;
      mesh.receiveShadow = true;
      scene.add(mesh);
      this.walls.push(mesh);
    }
  }

  hide() {
    this.tiles.forEach((tile) => (tile.mesh.visible = false));
    this.walls.forEach((wall) => (wall.visible = false));
  }

  show() {
    this.tiles.forEach((tile) => (tile.mesh.visible = true));
    this.walls.forEach((wall) => (wall.visible = true));
  }
}

export default Tilemap;
