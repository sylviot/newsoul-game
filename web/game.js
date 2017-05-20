var stats = new Stats();

var clock = new THREE.Clock();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0,0,700);

document.body.appendChild(stats.dom);
document.body.appendChild(renderer.domElement);

window.addEventListener('mousewheel', function(e){
    if(e.isTrusted){
      camera.position.z = Math.max(500, Math.min(650, camera.position.z+e.deltaY*0.5));
    }
});
window.addEventListener('mousedown', function(e){
  var x = (e.clientX-window.innerWidth/2), y = -(e.clientY-window.innerHeight/2);

  console.log(x, y)
});

function Tile(name, position) {
  this.texture = new THREE.ImageUtils.loadTexture(`assets/${name}.png`);
  this.material = new THREE.MeshBasicMaterial({map: this.texture});
  this.geometry = new THREE.PlaneGeometry(90, 32, 1, 1);
  this.mesh = new THREE.Mesh(this.geometry, this.material);
  this.mesh.position.set(position.x, position.y, 0);

  return this;
}

function Animated(name, frames, velocity, size, position){
  this.texture = new THREE.ImageUtils.loadTexture(`assets/${name}.png`);
  this.animation = new TextureAnimator(this.texture, frames, 1, frames, velocity);
  this.material = new THREE.MeshBasicMaterial({map: this.texture, transparent: true, opacity: 1.0});
  this.geometry = new THREE.PlaneGeometry(size.w, size.h, 1, 1);
  this.mesh = new THREE.Mesh(this.geometry, this.material);
  this.mesh.position.set(position.x, position.y, 0);

  return this;
}

function Player(name, position) {
  this.texture = new THREE.ImageUtils.loadTexture('assets/run.png');
  this.animation = new TextureAnimator(this.texture, 4, 1, 4, 105);
  this.material = new THREE.MeshBasicMaterial({map: this.texture, side: THREE.DoubleSide});
  this.geometry = new THREE.PlaneGeometry(50, 50, 1, 1);
  this.mesh = new THREE.Mesh(this.geometry, this.material);
  this.mesh.position.set(position.x, position.y, 0);

  return this;
}

/* SAMPLE */
var players =[];
function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) {	
  // note: texture passed by reference, will be updated by the update function.
          
  this.tilesHorizontal = tilesHoriz;
  this.tilesVertical = tilesVert;
  // how many images does this spritesheet contain?
  //  usually equals tilesHoriz * tilesVert, but not necessarily,
  //  if there at blank tiles at the bottom of the spritesheet. 
  this.numberOfTiles = numTiles;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
  texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

  // how long should each image be displayed?
  this.tileDisplayDuration = tileDispDuration;

  // how long has the current image been displayed?
  this.currentDisplayTime = 0;

  // which image is currently being displayed?
  this.currentTile = 0;
          
  this.update = function( milliSec )
  {
    this.currentDisplayTime += milliSec;
    while (this.currentDisplayTime > this.tileDisplayDuration)
    {
      this.currentDisplayTime -= this.tileDisplayDuration;
      this.currentTile++;
      if (this.currentTile == this.numberOfTiles)
              this.currentTile = 0;
      var currentColumn = this.currentTile % this.tilesHorizontal;
      texture.offset.x = currentColumn / this.tilesHorizontal;
      var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
      texture.offset.y = currentRow / this.tilesVertical;
    }
  };
}		

/* SAMPLE ANIMATION */
for(var i=-7;i<7;i++){
  var tile = new Tile('tile_1_1', {x:i*90,y:-280});
  scene.add(tile.mesh);
}

var portal = new Animated('portal', 14, 50, {w:90,h:107}, {x:-400,y:-216})
var portal2 = new Animated('portal_2', 7, 50, {w:128,h:122}, {x:400,y:-218})
scene.add(portal.mesh)
scene.add(portal2.mesh)

function animate(){
  requestAnimationFrame(animate);
  render();
  update();
}

function update(){
  var delta = clock.getDelta();
  for(var i=0;i< players.length;i++) players[i].animation.update(1000*delta);
  portal.animation.update(1000*delta);
  portal2.animation.update(1000*delta);

  stats.update();
}

function render(){
  renderer.render(scene, camera);
}

animate();
