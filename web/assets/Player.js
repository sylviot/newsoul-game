function Player(name) {
  var texture = new THREE.ImageUtils.loadTexture('resources/player.png'),
      material = new THREE.MeshBasicMaterial({color: 0xfff, map: texture}),
      geometry = new THREE.PlaneGeometry(32, 32),
      mesh = new THREE.Mesh(geometry, material);

  mesh.velocity = 2.5;
  mesh.height = 35;
  mesh.width = 35;

  mesh.position.set(40, 45, 0);

  mesh.applyGravity = function(gravity) {
    mesh.position.x += gravity.x;
    mesh.position.y += gravity.y;
  }

  mesh.moveLeft = function(gravity) {

  }

  mesh.moveRight = function(gravity) {

  }

  mesh.moveX = function(side){
    if(side == -1) mesh.position.x-=mesh.velocity;
    if(side == 1) mesh.position.x+=mesh.velocity;
  }
  mesh.moveY = function(side){
    if(side == -1) mesh.position.y-=mesh.velocity;
    if(side == 1) mesh.position.y+=mesh.velocity;
  }
  mesh.moveTo = function(x, y){
    console.log("move to:", x, y)
    mesh.position.x = x;
    mesh.position.y = y;
  }

  mesh.getName = function() {
    return name;
  }

  mesh.getPosition = function() { return mesh.position }

  mesh.keyboardBind = function(key) {
    if(key == 'LEFT') mesh.moveX(-1);
    if(key == 'RIGHT') mesh.moveX(1);
  }

  mesh.mouseBind = function(mouse) {

  }

  return mesh;
}
