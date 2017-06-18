function Player(name) {
  var texture = new THREE.ImageUtils.loadTexture('resources/player.png'),
      material = new THREE.MeshBasicMaterial({map: texture}),
      geometry = new THREE.PlaneGeometry(32, 32),
      mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(0, 0, -100);

  mesh.moveX = function(side){
    if(side == -1) mesh.position.x--;
    if(side == 1) mesh.position.x++;
  }
  mesh.moveY = function(side){
    if(side == -1) mesh.position.y--;
    if(side == 1) mesh.position.y++;
  }
  mesh.moveTo = function(x, y){
    console.log("move to:", x, y)
    mesh.position.x = x;
    mesh.position.y = y;
  }

  mesh.getName = function() {
    return name;
  }

  return mesh;
}
