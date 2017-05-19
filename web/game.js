var stats = new Stats();

var clock = new THREE.Clock();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0,0,400);

document.body.appendChild(stats.dom);
document.body.appendChild(renderer.domElement);
window.addEventListener('mousewheel', function(e){
    if(e.isTrusted){
      camera.position.z = Math.max(350, Math.min(500, camera.position.z+e.deltaY*0.1));
    }
});

/* SAMPLE */
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
var runner2Texture = new THREE.ImageUtils.loadTexture('assets/run.png');
var runner2Animation = new TextureAnimator(runner2Texture, 4, 1, 4, 105);
var runner2Material = new THREE.MeshBasicMaterial({map: runner2Texture, side: THREE.DoubleSide});
var runner2Geometry = new THREE.PlaneGeometry(50, 50, 1, 1);
var runner2 = new THREE.Mesh(runner2Geometry, runner2Material);
runner2.position.set(100, 0, 0);
scene.add(runner2);

var runnerTexture = new THREE.ImageUtils.loadTexture('assets/run.png');
var runnerAnimation = new TextureAnimator(runnerTexture, 4, 1, 4, 105);
var runnerMaterial = new THREE.MeshBasicMaterial({map: runnerTexture, side: THREE.DoubleSide});
var runnerGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
var runner = new THREE.Mesh(runnerGeometry, runnerMaterial);
runner.position.set(0, 0, 0);
scene.add(runner);


function animate(){
  requestAnimationFrame(animate);
  render();
  update();
}

function update(){
  var delta = clock.getDelta();
  runnerAnimation.update(1000 * delta);
  runner2Animation.update(1000 * delta);

  stats.update();
}

function render(){
  renderer.render(scene, camera);
}

animate();
