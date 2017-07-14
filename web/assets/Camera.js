function Camera() {
  var FOV = 60,//2 * Math.atan(window.innerHeight/ (2*700)) * 180 / Math.PI,
      WIDTH = window.innerWidth,
      HEIGHT = window.innerHeight,
      RATIO = WIDTH / HEIGHT,
      NEAR = 0.1,
      FAR = 720;


  var instance = new THREE.OrthographicCamera(WIDTH/-2, WIDTH/2, HEIGHT/2, HEIGHT/-2, 1, 1000);
  //var instance = new THREE.PerspectiveCamera(FOV, RATIO, NEAR, FAR);
  var _object = null,
      _boundHeight = null,
      _boundWidth = null,
      _cameraHeight = window.innerHeight,
      _cameraWidth = window.innerWidth;

  instance.setPosition = function(x, y, z) {
    instance.position.set(x, y, z);
  }

  instance.follow = function(object, boundHeight, boundWidth) {
    _object = object;
    _boundHeight = boundHeight;
    _boundWidth = boundWidth;
  }

  Math.toRadius = function(angle) {
    return angle * Math.PI / 180;
  }

  var old_position = null, new_position = null;
  instance.update = function() {
    new_position = {x: _object.position.x, y: _object.position.y,z: instance.position.z};

    var distance_x = _boundWidth + WIDTH/2;
    if(new_position.x < distance_x) {
      new_position.x = distance_x;
    }

    var distance_y = _boundHeight + HEIGHT/2;
    if(new_position.y < distance_y){
      new_position.y = distance_y;
    }

    instance.position.set(new_position.x, new_position.y, new_position.z);
  }

  return instance;
}
