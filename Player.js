import * as THREE from "three";
import animationProperties from "./public/duck.json";

class Player {
  constructor() {
    this.texture = new THREE.TextureLoader().load("duck.png");
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.minFilter = THREE.NearestFilter;
    this.texture.magFilter = THREE.NearestFilter;

    this.currentAnimation = animationProperties.idle;
    this.currentFrame = 0;
    this.textureFramesVertical = Object.keys(animationProperties).length;
    this.textureFramesHorizontal = 0;
    Object.values(animationProperties).forEach((animation) => {
      this.textureFramesHorizontal = Math.max(
        animation.count,
        this.textureFramesHorizontal,
      );
    });
    this.texture.repeat.set(
      1 / this.textureFramesHorizontal,
      1 / this.textureFramesVertical,
    );
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
      this.currentAnimation = animationProperties.idle;
      this.texture.repeat.setX(1 / this.textureFramesHorizontal);
    } else if (
      Math.abs(this.direction.y - this.direction.x) < 0.5 &&
      this.direction.x > 0 &&
      this.direction.y > 0
    ) {
      this.currentAnimation = animationProperties.walk_right_up;
      this.texture.repeat.setX(1 / this.textureFramesHorizontal);
    } else if (
      Math.abs(this.direction.y + this.direction.x) < 0.5 &&
      this.direction.x < 0 &&
      this.direction.y > 0
    ) {
      this.currentAnimation = animationProperties.walk_right_up;
      this.texture.repeat.setX(-1 / this.textureFramesHorizontal);
    } else if (
      Math.abs(this.direction.y + this.direction.x) < 0.5 &&
      this.direction.x > 0 &&
      this.direction.y < 0
    ) {
      this.currentAnimation = animationProperties.walk_right_down;
      this.texture.repeat.setX(1 / this.textureFramesHorizontal);
    } else if (
      this.direction.y > Math.abs(this.direction.x) &&
      this.direction.y > 0
    ) {
      this.currentAnimation = animationProperties.walk_up;
      this.texture.repeat.setX(1 / this.textureFramesHorizontal);
    } else if (
      Math.abs(this.direction.y - this.direction.x) < 0.5 &&
      this.direction.x < 0 &&
      this.direction.y < 0
    ) {
      this.currentAnimation = animationProperties.walk_right_down;
      this.texture.repeat.setX(-1 / this.textureFramesHorizontal);
    } else if (
      Math.abs(this.direction.y) > Math.abs(this.direction.x) &&
      this.direction.y < 0
    ) {
      this.currentAnimation = animationProperties.walk_down;
      this.texture.repeat.setX(1 / this.textureFramesHorizontal);
    } else if (this.direction.x > 0) {
      this.currentAnimation = animationProperties.walk_right;
      this.texture.repeat.setX(1 / this.textureFramesHorizontal);
    } else if (this.direction.x < 0) {
      this.currentAnimation = animationProperties.walk_right;
      this.texture.repeat.setX(-1 / this.textureFramesHorizontal);
    }

    this.currentFrame += dt * this.framesPerSecond;
    this.currentFrame %= this.currentAnimation.count;

    this.texture.offset.y =
      1 - (this.currentAnimation.row + 1) / this.textureFramesVertical;

    const offset = this.texture.repeat.x < 0 ? 1 : 0; // IDK why
    this.texture.offset.x =
      (Math.floor(this.currentFrame) + offset) / this.textureFramesHorizontal;
  }
}
export default Player;
