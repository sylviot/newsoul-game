function Splash(sceneManager, game) {
  this.camera = new THREE.PerspectiveCamera(75, window.devicePixelRatio, 0.1, 2000);
  this.scene = new THREE.Scene();

  this.camera.position.set(0, 0, 100);
  game.renderer.setClearColor(0x0F0, 1);

  this.up = function() {
    setTimeout(function(){ sceneManager.next(); }, 300);
  }

  this.down = function() {}

  this.update = function(){}
}

