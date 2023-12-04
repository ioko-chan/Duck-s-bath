import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import nipplejs from "nipplejs";

import DebugInfo from "./DebugInfo";
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

const debugInfo = new DebugInfo(document.getElementById("debug-wrapper"), 100);

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
  debugInfo.infos[0] = `FPS: ${Math.floor(1 / dt)}`;
  debugInfo.infos[1] = `Player position: ${
    Math.floor(player.sprite.position.x * 100) / 100
  } ${Math.floor(player.sprite.position.z * 100) / 100}`;
  debugInfo.infos[2] = `Current frame: ${Math.ceil(player.currentFrame)}`;
  debugInfo.infos[3] = `Camera position: ${
    Math.floor(camera.position.x * 100) / 100
  } ${Math.floor(camera.position.y * 100) / 100} ${
    Math.floor(camera.position.z * 100) / 100
  }`;

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
