function Player(name) {
  var texture = new THREE.ImageUtils.loadTexture('resources/player.png'),
      material = new THREE.MeshBasicMaterial({color: 0xfff, map: texture}),
      geometry = new THREE.PlaneGeometry(32, 32),
      mesh = new THREE.Mesh(geometry, material);

  var new_position = {x:300, y:45, z:0};
  mesh.velocity = 5.5;
  mesh.height = 35;
  mesh.width = 35;

  mesh.position.set(new_position.x, new_position.y, new_position.z);

  mesh.applyGravity = function(gravity) {
    mesh.position.x += gravity.x;
    mesh.position.y += gravity.y;
  }

  mesh.moveX = function(side){
    if(side == -1) new_position.x-=mesh.velocity;
    if(side == 1) new_position.x+=mesh.velocity;
  }
  mesh.moveY = function(side){
    if(side == -1) new_position.y-=mesh.velocity;
    if(side == 1) new_position.y+=mesh.velocity;
  }
  mesh.moveTo = function(x, y){
    new_position.x = x;
    new_position.y = y;
  }


  mesh.getName = function() { return name; }
  mesh.getPosition = function() { return new_position; }

  mesh.keyboardBind = function(key) {
    if(key == 'LEFT') mesh.moveX(-1);
    if(key == 'RIGHT') mesh.moveX(1);
  }

  mesh.mouseBind = function(mouse) {

  }

  mesh.update = function() {
    var delta = 0.2;

    mesh.position.set(
      THREE.Math.lerp(mesh.position.x, new_position.x, delta),
      THREE.Math.lerp(mesh.position.y, new_position.y, delta),
      THREE.Math.lerp(mesh.position.z, new_position.z, delta)
    );
  }

  return mesh;
}
