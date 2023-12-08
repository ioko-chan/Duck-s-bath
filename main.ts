import * as THREE from "three";
import nipplejs from "nipplejs";
import GUI from "lil-gui";

import Player from "./Player";
import Camera from "./Camera";
import Tilemap from "./Tilemap";

import * as FirstFloorTilemapProperties from "./public/FirstFloor.json";
import * as SecondFloorTilemapProperties from "./public/SecondFloor.json";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const width = window.innerWidth;
const height = window.innerHeight;
const scene = new THREE.Scene();
const camera = new Camera(45, width / height, 1, 100);
const clock = new THREE.Clock();

const player = new Player(scene);

const ambientLight = new THREE.AmbientLight("white", 3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("white", 3);
directionalLight.position.set(0, 1, 0);
directionalLight.target.position.set(1, 0, -1);
directionalLight.castShadow = true;
scene.add(
  directionalLight,
  directionalLight.target,
  new THREE.DirectionalLightHelper(directionalLight),
);

const firstFloor = new Tilemap(scene, FirstFloorTilemapProperties);
const secondFloor = new Tilemap(scene, SecondFloorTilemapProperties);

const vertices: Array<number> = [];

const stairsWidth = 1;
const stairsHeight = 2;
const stairsLength = 3;

const stairsRotation = Math.PI / 2;

const stepWidth = stairsWidth;
const stepHeight = 0.1;
const stepCount = stairsHeight / stepHeight;
const stepLength = stairsLength / stepCount;

for (let i = 0; i < stepCount; ++i) {
  vertices.push(
    0,
    i * stepHeight,
    i * -stepLength,
    stepWidth,
    i * stepHeight,
    i * -stepLength,
    0,
    i * stepHeight + stepHeight,
    i * -stepLength,
    stepWidth,
    i * stepHeight,
    i * -stepLength,
    stepWidth,
    i * stepHeight + stepHeight,
    i * -stepLength,
    0,
    i * stepHeight + stepHeight,
    i * -stepLength,
    0,
    i * stepHeight + stepHeight,
    i * -stepLength,
    0,
    i * stepHeight + stepHeight,
    i * -stepLength - stepLength,
    stepWidth,
    i * stepHeight + stepHeight,
    i * -stepLength - stepLength,
    stepWidth,
    i * stepHeight + stepHeight,
    i * -stepLength,
    stepWidth,
    i * stepHeight + stepHeight,
    i * -stepLength - stepLength,
    0,
    i * stepHeight + stepHeight,
    i * -stepLength,
    stepWidth,
    0,
    i * -stepLength,
    stepWidth,
    i * stepHeight + stepHeight,
    i * -stepLength,
    stepWidth,
    i * stepHeight + stepHeight,
    i * -stepLength - stepLength,
    stepWidth,
    0,
    i * -stepLength,
    stepWidth,
    0,
    i * -stepLength - stepLength,
    stepWidth,
    i * stepHeight + stepHeight,
    i * -stepLength - stepLength,
    0,
    0,
    i * -stepLength,
    0,
    i * stepHeight + stepHeight,
    i * -stepLength,
    0,
    i * stepHeight + stepHeight,
    i * -stepLength - stepLength,
    0,
    0,
    i * -stepLength,
    0,
    0,
    i * -stepLength - stepLength,
    0,
    i * stepHeight + stepHeight,
    i * -stepLength - stepLength,
  );
}

function isPointInsideRect(
  rect1: THREE.Vector2,
  rect2: THREE.Vector2,
  point: THREE.Vector2,
) {
  const A = new THREE.Vector2(rect1.x, rect1.y);
  const B = new THREE.Vector2(rect2.x, rect1.y);
  const C = new THREE.Vector2(rect2.x, rect2.y);
  const vec = (p1: THREE.Vector2, p2: THREE.Vector2) => {
    return new THREE.Vector2(p2.x - p1.x, p2.y - p1.y);
  };
  const AB = vec(A, B);
  const AM = vec(A, point);
  const BC = vec(B, C);
  const BM = vec(B, point);
  const dotABAM = AB.dot(AM);
  const dotABAB = AB.dot(AB);
  const dotBCBM = BC.dot(BM);
  const dotBCBC = BC.dot(BC);
  return (
    0 <= dotABAM && dotABAM <= dotABAB && 0 <= dotBCBM && dotBCBM <= dotBCBC
  );
}

const stairs = {
  material: new THREE.MeshStandardMaterial({
    color: "blue",
    side: THREE.DoubleSide,
  }),
  geometry: new THREE.BufferGeometry(),
  mesh: new THREE.Mesh(),
};
stairs.geometry.setAttribute(
  "position",
  new THREE.BufferAttribute(new Float32Array(vertices), 3),
);
stairs.mesh.geometry = stairs.geometry;
stairs.mesh.material = stairs.material;
stairs.mesh.castShadow = true;
stairs.mesh.receiveShadow = true;
stairs.mesh.position.x = -9 + stairsLength;
stairs.mesh.position.z = -9;
stairs.mesh.rotateY(stairsRotation);
scene.add(stairs.mesh);

let debug_info = { FPS: 0 };

function animate() {
  // Render
  renderer.render(scene, camera);

  // Update
  let dt = clock.getDelta();
  player.update(dt);
  camera.update(dt, player.sprite.mesh.position);

  const stairsPosition1 = new THREE.Vector2(
    stairs.mesh.position.x,
    stairs.mesh.position.z,
  );
  const stairsPosition2 = new THREE.Vector2(
    stairs.mesh.position.x - stairsWidth,
    stairs.mesh.position.z + stairsLength,
  ).rotateAround(stairsPosition1, stairsRotation);

  if (
    isPointInsideRect(
      stairsPosition1,
      stairsPosition2,
      new THREE.Vector2(
        player.sprite.mesh.position.x,
        player.sprite.mesh.position.z,
      ),
    )
  ) {
    const startX = stairs.mesh.position.x;
    const endX = startX - stairsLength;
    const x = player.sprite.mesh.position.x - startX;
    const normalX = x / (endX - startX);
    player.sprite.mesh.position.y = normalX * stairsHeight + 0.5;
  }

  if (player.sprite.mesh.position.y >= secondFloor.y) {
    secondFloor.show();
  } else {
    secondFloor.hide();
  }
  // Debug info
  debug_info.FPS = Math.floor(1 / dt);
  requestAnimationFrame(animate);
}
animate();

const nipplejsWrapper = document.getElementById("nipplejs-wrapper");
if (nipplejsWrapper === null) {
  throw new Error("Element with id 'nipplejs-wrapper' nor found");
}
let manager = nipplejs.create({
  size: (nipplejsWrapper.clientHeight * 3) / 4,
  zone: nipplejsWrapper,
  mode: "static",
  position: {
    top: `${nipplejsWrapper.clientHeight / 2}px`,
    left: `${nipplejsWrapper.clientWidth / 2}px`,
  },
});
manager.on("move", (_event, data) => {
  player.direction = new THREE.Vector2(
    data.vector.x,
    data.vector.y,
  ).multiplyScalar(Math.min(data.force, 1));
});
manager.on("end", (_event) => {
  player.direction = new THREE.Vector2(0, 0);
});

const gui = new GUI().title("Debug menu");
const info_folder = gui.addFolder("Info");
Object.keys(debug_info).forEach((key) => {
  info_folder.add(debug_info, key).disable();
});
const player_folder = gui.addFolder("Player");
player_folder.add(player.sprite.mesh.position, "x").name("Position.x");
player_folder.add(player.sprite.mesh.position, "y").name("Position.y");
player_folder.add(player.sprite.mesh.position, "z").name("Position.z");
player_folder.add(player, "movementSpeed", 0, 5).name("Speed");
player_folder.add(player.animation, "framesPerSecond").name("Frames/second");

const camera_folder = gui.addFolder("Camera");
camera_folder.add(camera.offset, "x").name("Offset.x");
camera_folder.add(camera.offset, "y").name("Offset.y");
camera_folder.add(camera.offset, "z").name("Offset.z");
camera_folder.add(camera, "speed", 0, 5).name("Speed");

const light_folder = gui.addFolder("Light");
light_folder.add(ambientLight, "intensity", 0, 5).name("Intensity");
light_folder.addColor(ambientLight, "color").name("Color");

setInterval(() => {
  gui
    .controllersRecursive()
    .forEach((controller) => controller.updateDisplay());
}, 200);
