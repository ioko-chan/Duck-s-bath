import * as THREE from "three";

class Player {
  constructor() {
    this.texture = new THREE.TextureLoader().load("duck.png");
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.minFilter = THREE.NearestFilter;
    this.texture.magFilter = THREE.NearestFilter;

    this.framesCount = 6;
    this.currentFrame = 0;
    this.texture.repeat.set(1 / this.framesCount, 1);
    this.framesPerSecond = 8;
    this.frameTime = 0;

    this.material = new THREE.SpriteMaterial({ map: this.texture });
    this.sprite = new THREE.Sprite(this.material);
    this.direction = new THREE.Vector2(0, 0);
    this.movementSpeed = 2;
  }

  update(dt) {
    this.sprite.translateX(this.direction.x * this.movementSpeed * dt);
    this.sprite.translateY(this.direction.y * this.movementSpeed * dt);

    if (this.direction.lengthSq() === 0) {
      this.currentFrame = 0;
    }

    this.frameTime += dt;
    if (this.frameTime >= 1 / this.framesPerSecond) {
      this.currentFrame = (this.currentFrame + 1) % this.framesCount;
      this.texture.offset.x = this.currentFrame / this.framesCount;
      this.frameTime = 0;
    }
  }
}
export default Player;
