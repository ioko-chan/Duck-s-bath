import * as THREE from "three";

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
export default Player;
