var stats = new Stats();

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(stats.dom);
document.body.appendChild(renderer.domElement);

/* SAMPLE */
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({color: 0x0000ff});
var cube = new THREE.Mesh(geometry, material);

scene.add(cube);

camera.position.z = 5;

function render(){
  requestAnimationFrame(render);

  cube.rotation.x += 0.02;
  cube.rotation.y += 0.04;
  cube.rotation.z += 0.03;

  renderer.render(scene, camera);
  stats.update();
}

render();
