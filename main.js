import * as THREE from "three";
import nipplejs from "nipplejs";
import GUI from "lil-gui";

import Player from "./Player";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const width = window.innerWidth;
const height = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
camera.speed = 2;
camera.rotation.x = -Math.PI / 8;
camera.offset = new THREE.Vector3(0, 5, 10);

const clock = new THREE.Clock();

const player = new Player();
scene.add(player.sprite.mesh, player.collider.mesh);

const gridSize = 10;
const gridHelper = new THREE.GridHelper(gridSize, gridSize).translateY(-0.49);
scene.add(gridHelper);

const axisHelper = new THREE.AxesHelper(10).translateY(-0.49);
scene.add(axisHelper);

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

const planeSize = 10;
const geometry = new THREE.PlaneGeometry(planeSize, planeSize);
const material = new THREE.MeshStandardMaterial({
  color: "gray",
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(geometry, material)
  .translateY(-0.5)
  .rotateX(Math.PI / 2);
plane.receiveShadow = true;
scene.add(plane);

let debug_info = {};

function animate() {
  // Render
  renderer.render(scene, camera);

  // Update
  let dt = clock.getDelta();
  player.update(dt);
  camera.position.lerp(
    new THREE.Vector3().copy(player.sprite.mesh.position).add(camera.offset),
    camera.speed * dt,
  );

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
