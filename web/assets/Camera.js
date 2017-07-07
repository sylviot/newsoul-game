function Camera() {
  var instance = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 900);

  instance.setPosition = function(x, y, z) {
    instance.position.set(x, y, z);
  }

  return instance;
}
