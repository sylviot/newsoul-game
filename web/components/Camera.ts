import * as THREE from 'three'

export class Camera {
  
  static basic(): any {
    let camera = new THREE.PerspectiveCamera(75, window.devicePixelRatio, 0.1, 2000)
    
    return camera
  }

  static OrthographicCamera(): THREE.Camera {
    return  new THREE.OrthographicCamera(
      window.innerWidth/-2,   /* LEFT */
      window.innerWidth/2,    /* RIGHT */
      window.innerHeight/2,   /* TOP */
      window.innerHeight/-2,  /* BOTTOM */
      0.1,                      /* NEAR */
      1000                    /* FAR */
    )
  }
}