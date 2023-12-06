import * as THREE from "three";
import nipplejs from "nipplejs";
import GUI from "lil-gui";

import Player from "./Player";
import Camera from "./Camera";
import Tilemap from "./Tilemap";

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

new Tilemap(scene);

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
  mesh.position.y = wall_height / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);
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
  mesh.position.y = wall_height / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);
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
  mesh.position.y = wall_height / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

let debug_info = { FPS: 0 };

function animate() {
  // Render
  renderer.render(scene, camera);

  // Update
  let dt = clock.getDelta();
  player.update(dt);
  camera.update(dt, player.sprite.mesh.position);

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
