import * as THREE from "three";
import animationProperties from "./public/duck.json";

interface ISprite {
  texture: THREE.Texture;
  geometry: THREE.PlaneGeometry;
  material: THREE.MeshStandardMaterial;
  mesh: THREE.Mesh;
}

interface ICollider {
  material: THREE.ShadowMaterial;
  geometry: THREE.CapsuleGeometry;
  mesh: THREE.Mesh;
}

interface IAnimationProperty {
  row: number;
  count: number;
}

interface IAnimation {
  currentAnimation: IAnimationProperty;
  currentFrame: number;
  framesPerSecond: number;
  framesHorizontal: number;
  framesVertical: number;
}

class Player {
  sprite: ISprite;
  collider: ICollider;
  animation: IAnimation;
  direction = new THREE.Vector2(0, 0);
  movementSpeed = 2;

  constructor(scene: THREE.Scene) {
    this.createSprite();
    this.createCollider();
    this.initiateAnimation();
    scene.add(this.sprite.mesh, this.collider.mesh);
  }

  initiateAnimation() {
    this.animation = {
      currentAnimation: animationProperties.idle,
      currentFrame: 0,
      framesPerSecond: 8,
      framesHorizontal: Math.max(
        ...Object.values(animationProperties).map((x) => x.count),
      ),
      framesVertical: Object.keys(animationProperties).length,
    };
    this.sprite.texture.repeat.set(
      1 / this.animation.framesHorizontal,
      1 / this.animation.framesVertical,
    );
  }

  createSprite() {
    this.sprite = {
      texture: new THREE.TextureLoader().load("duck.png"),
      geometry: new THREE.PlaneGeometry(1, 1),
      material: new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        transparent: true,
      }),
      mesh: new THREE.Mesh(),
    };
    this.sprite.texture.colorSpace = THREE.SRGBColorSpace;
    this.sprite.texture.minFilter = THREE.NearestFilter;
    this.sprite.texture.magFilter = THREE.NearestFilter;
    this.sprite.material.map = this.sprite.texture;
    this.sprite.mesh.geometry = this.sprite.geometry;
    this.sprite.mesh.material = this.sprite.material;
  }

  createCollider() {
    this.collider = {
      material: new THREE.ShadowMaterial({ side: THREE.DoubleSide }),
      geometry: new THREE.CapsuleGeometry(0.4, 0.4),
      mesh: new THREE.Mesh(),
    };
    this.collider.mesh.geometry = this.collider.geometry;
    this.collider.mesh.material = this.collider.material;
    this.collider.mesh.castShadow = true;
  }

  update(dt: number) {
    this.move(dt);
    this.animate(dt);
  }

  move(dt: number) {
    this.sprite.mesh.translateX(this.direction.x * this.movementSpeed * dt);
    this.sprite.mesh.translateZ(-this.direction.y * this.movementSpeed * dt);

    this.collider.mesh.position.copy(this.sprite.mesh.position);
  }

  animate(dt: number) {
    if (this.direction.x === 0 && this.direction.y === 0) {
      this.animation.currentAnimation = animationProperties.idle;
      this.sprite.texture.repeat.setX(1 / this.animation.framesHorizontal);
    } else {
      const angle = Math.atan2(this.direction.y, this.direction.x);
      const octant = Math.round((8 * angle) / (2 * Math.PI) + 8) % 8;
      switch (octant) {
        case 0: // Right
        case 4: // Left
          this.animation.currentAnimation = animationProperties.walk_right;
          break;
        case 1: // Right top
        case 3: // Left top
          this.animation.currentAnimation = animationProperties.walk_right_up;
          break;
        case 2: // Top
          this.animation.currentAnimation = animationProperties.walk_up;
          break;
        case 5: // Left bottom
        case 7: // Right bottom
          this.animation.currentAnimation = animationProperties.walk_right_down;
          break;
        case 6: // Bottom
          this.animation.currentAnimation = animationProperties.walk_down;
          break;
        default:
          console.error(`Wrong octant value: ${octant}`);
          break;
      }

      // Flip if move left
      this.sprite.texture.repeat.setX(
        (octant >= 3 && octant <= 5 ? -1 : 1) / this.animation.framesHorizontal,
      );
    }

    this.animation.currentFrame =
      (this.animation.currentFrame + dt * this.animation.framesPerSecond) %
      this.animation.currentAnimation.count;

    this.sprite.texture.offset.y =
      1 -
      (this.animation.currentAnimation.row + 1) / this.animation.framesVertical;

    const offset = this.sprite.texture.repeat.x < 0 ? 1 : 0; // IDK why
    this.sprite.texture.offset.x =
      (Math.floor(this.animation.currentFrame) + offset) /
      this.animation.framesHorizontal;
  }
}
export default Player;
