import * as THREE from "three";
import nipplejs from "nipplejs";

import DebugInfo from "./DebugInfo";
import Player from "./Player";

const scene = new THREE.Scene();
const w = window.innerWidth;
const h = window.innerHeight;
const viewSize = h / 200;
const aspectRatio = w / h;
const viewport = {
  viewsize: viewSize,
  aspectRatio: aspectRatio,
  left: (-aspectRatio * viewSize) / 2,
  right: (aspectRatio * viewSize) / 2,
  top: viewSize / 2,
  bottom: -viewSize / 2,
  near: -100,
  far: 100,
};
const camera = new THREE.OrthographicCamera(
  viewport.left,
  viewport.right,
  viewport.top,
  viewport.bottom,
  viewport.near,
  viewport.far,
);
camera.position.z = 1;
camera.speed = 2;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const clock = new THREE.Clock();

const player = new Player();
scene.add(player.sprite);

const gridSize = 10;
const gridHelper = new THREE.GridHelper(gridSize, gridSize).rotateX(
  Math.PI / 2,
);
scene.add(gridHelper);

const debugInfo = new DebugInfo(document.getElementById("debug-wrapper"), 200);

function animate() {
  // Render
  renderer.render(scene, camera);

  // Update
  let dt = clock.getDelta();
  player.update(dt);
  camera.position.lerp(player.sprite.position, camera.speed * dt);

  // Debug info
  debugInfo.infos[0] = `FPS: ${Math.floor(1 / dt)}`;
  debugInfo.infos[1] = `Player position: ${
    Math.floor(player.sprite.position.x * 100) / 100
  } ${Math.floor(player.sprite.position.y * 100) / 100}`;

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
