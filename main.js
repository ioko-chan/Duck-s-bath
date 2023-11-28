import * as THREE from "three";
import nipplejs from "nipplejs";

const scene = new THREE.Scene();
const w = window.innerWidth;
const h = window.innerHeight;
const viewSize = h / 100;
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
    if (this.direction.lengthSq() !== 0) {
      let direction = new THREE.Vector2().copy(this.direction).normalize();
      this.sprite.translateX(direction.x * this.movementSpeed * dt);
      this.sprite.translateY(direction.y * this.movementSpeed * dt);
    }
  }
}
const player = new Player();
scene.add(player.sprite);

const gridHelper = new THREE.GridHelper(10, 10).rotateX(90);
scene.add(gridHelper);

document.addEventListener("keydown", (event) => {
  if (event.repeat === true) return;
  switch (event.key.toLowerCase()) {
    case "a":
      player.direction.x -= 1;
      break;
    case "d":
      player.direction.x += 1;
      break;
    case "w":
      player.direction.y += 1;
      break;
    case "s":
      player.direction.y -= 1;
      break;

    default:
      break;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.repeat === true) return;
  switch (event.key.toLowerCase()) {
    case "a":
      player.direction.x += 1;
      break;
    case "d":
      player.direction.x -= 1;
      break;
    case "w":
      player.direction.y -= 1;
      break;
    case "s":
      player.direction.y += 1;
      break;

    default:
      break;
  }
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  let dt = clock.getDelta();
  player.update(dt);
}
animate();

let manager = nipplejs.create();
