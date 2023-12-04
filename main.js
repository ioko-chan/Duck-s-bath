import * as THREE from "three";
import nipplejs from "nipplejs";
import GUI from "lil-gui";

import Player from "./Player";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const width = window.innerWidth;
const height = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
camera.speed = 2;
camera.rotation.x = -Math.PI / 8;

const clock = new THREE.Clock();

const player = new Player();
scene.add(player.sprite);

const gridSize = 10;
const gridHelper = new THREE.GridHelper(gridSize, gridSize);
scene.add(gridHelper);

const axisHelper = new THREE.AxesHelper(10);
scene.add(axisHelper);

const ambientLight = new THREE.AmbientLight("white", 3);
scene.add(ambientLight);

let debug_info = {};

function animate() {
  // Render
  renderer.render(scene, camera);

  // Update
  let dt = clock.getDelta();
  player.update(dt);
  const target = new THREE.Vector3(
    player.sprite.position.x,
    5,
    player.sprite.position.z + 10,
  );
  camera.position.lerp(target, camera.speed * dt);

  // Debug info
  debug_info.FPS = Math.floor(1 / dt);

  requestAnimationFrame(animate);
}
animate();

const nipplejsWrapper = document.getElementById("nipplejs-wrapper");
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
player_folder.add(player.sprite.position, "x").name("Position.x");
player_folder.add(player.sprite.position, "y").name("Position.y");
player_folder.add(player.sprite.position, "z").name("Position.z");
player_folder.add(player, "movementSpeed", 0, 5).name("Speed");

const camera_folder = gui.addFolder("Camera");
camera_folder.add(camera, "speed", 0, 5).name("Speed");

const light_folder = gui.addFolder("Light");
light_folder.add(ambientLight, "intensity", 0, 5).name("Intensity");
light_folder.addColor(ambientLight, "color").name("Color");

setInterval(() => {
  gui
    .controllersRecursive()
    .forEach((controller) => controller.updateDisplay());
}, 200);
