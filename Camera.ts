import * as THREE from "three";

class Camera extends THREE.PerspectiveCamera {
  speed = 2;
  offset = new THREE.Vector3(0, 5, 10);

  constructor(fov: number, aspect: number, near: number, far: number) {
    super(fov, aspect, near, far);
    this.rotation.x = -Math.PI / 8;
  }

  update(dt: number, target: THREE.Vector3) {
    this.position.lerp(
      new THREE.Vector3().copy(target).add(this.offset),
      this.speed * dt,
    );
  }
}

export default Camera;
