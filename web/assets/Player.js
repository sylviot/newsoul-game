function Player(name) {
  var texture = new THREE.ImageUtils.loadTexture('resources/player.png'),
      material = new THREE.MeshBasicMaterial({color: 0xfff, map: texture}),
      geometry = new THREE.PlaneGeometry(32, 32),
      mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(15, 35, 0);

  mesh.moveX = function(side){
    if(side == -1) mesh.position.x-=2;
    if(side == 1) mesh.position.x+=2;
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
