import * as THREE from 'three'

export class Camera {
  
  static basic(): any {
    let camera = new THREE.PerspectiveCamera(75, window.devicePixelRatio, 0.1, 2000)
    
    return camera
  }
}