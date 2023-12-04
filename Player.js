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

    this.material = new THREE.MeshStandardMaterial({
      map: this.texture,
      side: THREE.DoubleSide,
      transparent: true,
    });
    this.geometry = new THREE.PlaneGeometry(1, 1);
    this.sprite = new THREE.Mesh(this.geometry, this.material);
    this.direction = new THREE.Vector2(0, 0);
    this.movementSpeed = 2;
  }

  update(dt) {
    this.movement(dt);
    this.animation(dt);
  }

  movement(dt) {
    this.sprite.translateX(this.direction.x * this.movementSpeed * dt);
    this.sprite.translateZ(-this.direction.y * this.movementSpeed * dt);
  }

  animation(dt) {
    if (this.direction.x === 0 && this.direction.y === 0) {
      this.currentAnimation = animationProperties.idle;
      this.texture.repeat.setX(1 / this.textureFramesHorizontal);
    } else {
      const angle = Math.atan2(this.direction.y, this.direction.x);
      const octant = Math.round((8 * angle) / (2 * Math.PI) + 8) % 8;
      switch (octant) {
        case 0: // Right
        case 4: // Left
          this.currentAnimation = animationProperties.walk_right;
          break;
        case 1: // Right top
        case 3: // Left top
          this.currentAnimation = animationProperties.walk_right_up;
          break;
        case 2: // Top
          this.currentAnimation = animationProperties.walk_up;
          break;
        case 5: // Left bottom
        case 7: // Right bottom
          this.currentAnimation = animationProperties.walk_right_down;
          break;
        case 6: // Bottom
          this.currentAnimation = animationProperties.walk_down;
          break;
        default:
          console.error(`Wrong octant value: ${octant}`);
          break;
      }

      // Flip if move left
      this.texture.repeat.setX(
        (octant >= 3 && octant <= 5 ? -1 : 1) / this.textureFramesHorizontal,
      );
    }

    this.currentFrame =
      (this.currentFrame + dt * this.framesPerSecond) %
      this.currentAnimation.count;

    this.texture.offset.y =
      1 - (this.currentAnimation.row + 1) / this.textureFramesVertical;

    const offset = this.texture.repeat.x < 0 ? 1 : 0; // IDK why
    this.texture.offset.x =
      (Math.floor(this.currentFrame) + offset) / this.textureFramesHorizontal;
  }
}
export default Player;
