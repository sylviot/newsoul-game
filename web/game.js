var stats = new Stats();
var renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setClearColor(0xFFFFFF, 1);
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(stats.dom);
document.body.appendChild(renderer.domElement);

var sceneManager = new SceneManager({renderer: renderer});
sceneManager.change(Info)
//setInterval(function(){  sceneManager.next(); console.log('Timeout 1000ms') }, 1000);

function SceneManager(game) {
  this.scenes = [Loading, Game];
  this.scenesIndex= 0;

  this.initialize = function() {
    this.next();
  }

  this.next = function() {
    var scene = this.scenes[this.scenesIndex++ % this.scenes.length];
    this.change(scene);
  }
    
  this.change = function(scene) {
    this.current =  new scene(this, {'renderer': game.renderer});
  }

  this.initialize();
}

function Info(sceneManager, game) {
  this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  this.scene = new THREE.Scene();

  game.renderer.setClearColor(0x000, 1);
  game.renderer.setSize(window.innerWidth, window.innerHeight);

  var text = document.createElement('h1');
  text.style.position = 'fixed';
  text.style.width = '100%';
  text.style.top = '30%';
  text.style.color = 'white';
  text.style.textAlign = 'center';

  text.innerHTML= 'NEW SOUL <br><br> 1º Open Server - Dia 02 de Julho de 2017';
  document.body.appendChild(text);
}

function Game(sceneManager, game) {
  this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  this.clock = new THREE.Clock();
  this.scene = new THREE.Scene();

  this.camera.position.set(0, 0, 700);
  game.renderer.setClearColor(0x000, 1);
  game.renderer.setSize(window.innerWidth, window.innerHeight);

  var texture = new THREE.ImageUtils.loadTexture('assets/tile_2_2.png'),
      material = new THREE.MeshBasicMaterial({map: texture}),
      geometry = new THREE.PlaneGeometry(90, 32, 1, 1),
      mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(-90, -280, 0);
  this.scene.add(mesh);
}

function Loading(sceneManager, game) {
  this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  this.clock = new THREE.Clock();
  this.scene = new THREE.Scene();

  this.camera.position.set(0, 0, 700);
  game.renderer.setClearColor(0xa3e0ed, 1);
  game.renderer.setSize(window.innerWidth, window.innerHeight);

  var texture = new THREE.ImageUtils.loadTexture('assets/tile_1_1.png'),
      material = new THREE.MeshBasicMaterial({map: texture}),
      geometry = new THREE.PlaneGeometry(90, 32, 1, 1),
      mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(-90, -280, 0);
  this.scene.add(mesh);
}

function animate(){
  requestAnimationFrame(animate);
  render();
  update();
}


function update(){
  var delta = sceneManager.current.clock.getDelta();
  stats.update();
}

function render(){
  renderer.render(sceneManager.current.scene, sceneManager.current.camera);
}

animate();
