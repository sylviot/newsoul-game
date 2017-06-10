var stats = new Stats();

var clock = new THREE.Clock();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
var renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setClearColor(0xa3e0ed, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0,0,700);

document.body.appendChild(stats.dom);

function animate(){
  requestAnimationFrame(animate);
  render();
  update();
}


function update(){
  var delta = clock.getDelta();
  stats.update();
}

function render(){
  renderer.render(scene, camera);
}

animate();
