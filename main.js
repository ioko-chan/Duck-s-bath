import * as THREE from "three";
import nipplejs from "nipplejs";

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

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const clock = new THREE.Clock();

class Player {
  constructor() {
    this.map = new THREE.TextureLoader().load("apple.png");
    this.material = new THREE.SpriteMaterial({ map: this.map });
    this.sprite = new THREE.Sprite(this.material);
    this.direction = new THREE.Vector2(0, 0);
    this.movementSpeed = 2;
  }

  update(dt) {
    this.sprite.translateX(this.direction.x * this.movementSpeed * dt);
    this.sprite.translateY(this.direction.y * this.movementSpeed * dt);
  }
}
const player = new Player();
scene.add(player.sprite);

const gridSize = 10;
const gridHelper = new THREE.GridHelper(gridSize, gridSize).rotateX(
  Math.PI / 2,
);
scene.add(gridHelper);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  let dt = clock.getDelta();
  player.update(dt);
}
animate();

const nipplejsWrapper = document.getElementById("nipplejs-wrapper");
let manager = nipplejs.create({
  size: (nipplejsWrapper.clientHeight * 3) / 4,
  zone: nipplejsWrapper,
  mode: "static",
  position: { top: "10dvh", left: "10dvh" },
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
