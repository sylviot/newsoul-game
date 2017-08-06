function BugReport(renderer, callback) {
  var bug_input = document.createElement('textarea');
  bug_input.id = 'bug_input';
  bug_input.style.width = 200;
  bug_input.style.height = 100;
  bug_input.style.position = 'fixed';
  bug_input.style.top = 0;
  bug_input.style.right = '40px';
  bug_input.rows = 3;
  bug_input.style.display = 'none';

  var bug_button = document.createElement('div');
  bug_button.id = 'bug_button';
  bug_button.innerHTML = "BUG";
  bug_button.style.textAlign = 'center';
  bug_button.style.fontSize = '17px';
  bug_button.style.fontWeight = 'bold';
  bug_button.style.lineHeight = '30px';
  bug_button.style.color = 'white';
  bug_button.style.backgroundColor = '#3F51B5';
  bug_button.style.borderRadius = '7px';
  bug_button.style.cursor = 'pointer';
  bug_button.style.width = '40px';
  bug_button.style.height = '30px';
  bug_button.style.position = 'fixed';
  bug_button.style.top = 0;
  bug_button.style.right = 0;

  var bug_send = document.createElement('div');
  bug_send.id = 'bug_send';
  bug_send.innerHTML = "SEND";
  bug_send.style.textAlign = 'center';
  bug_send.style.fontSize = '14px';
  bug_send.style.fontWeight = 'bold';
  bug_send.style.lineHeight = '30px';
  bug_send.style.color = 'white';
  bug_send.style.backgroundColor = '#4CAF50';
  bug_send.style.borderRadius = '7px';
  bug_send.style.cursor = 'pointer';
  bug_send.style.width = '40px';
  bug_send.style.height = '30px';
  bug_send.style.position = 'fixed';
  bug_send.style.top = '31px';
  bug_send.style.right = 0;
  bug_send.style.display = 'none';

  document.body.appendChild(bug_button);
  document.body.appendChild(bug_send);
  document.body.appendChild(bug_input);

  bug_button.addEventListener('click', function(){
    var d = bug_input.style.display;
    d = (d=='none'?'inherit':'none');

    bug_input.style.display = d;
    bug_send.style.display = d;
  });

  bug_send.addEventListener('click', function(){
    var data = renderer.domElement.toDataURL();
    var bug = bug_input.value;

    callback(data, bug);
    bug_input.value = '';
  });
}

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

  instance.follow = function(object, boundX, boundY, boundWidth, boundHeight) {
    _object = object;
    _boundX = boundX;
    _boundY = boundY;
    _boundWidth = boundWidth;
    _boundHeight = boundHeight;
  }

  Math.toRadius = function(angle) {
    return angle * Math.PI / 180;
  }

  var new_position = null;
  instance.update = function() {
    new_position = {x: _object.position.x, y: _object.position.y,z: instance.position.z};

    var distance_x = _boundX + WIDTH/2,
        distance_bound_x = _boundWidth - WIDTH/2;
    if(new_position.x < distance_x) {
      new_position.x = distance_x;
    } else if(new_position.x > distance_bound_x){
      new_position.x = distance_bound_x;
    }

    var distance_y = _boundY + HEIGHT/2;
    if(new_position.y < distance_y){
      new_position.y = distance_y;
    } 

    var delta = 0.1;
    instance.position.set(THREE.Math.lerp(instance.position.x, new_position.x, delta), THREE.Math.lerp(instance.position.y, new_position.y, delta), new_position.z);
  }

  return instance;
}

function Chat() {
  var that = this;

  var CONFIGURATION = {
    fontSize: '13px',
    fontFamily: 'cursive'
  }

  var messages = [];

  var chat = document.createElement('div');
  chat.id = 'chat';
  chat.style.position = 'fixed';
  chat.style.bottom = '0px';
  chat.style.left = '0px';
  chat.style.width = (window.innerWidth * 0.3) + 'px';
  chat.style.height = (window.innerHeight * 0.4) + 'px';

  var chat_message = document.createElement('div');
  chat_message.id = "chat_message";
  chat_message.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
  chat_message.style.width = '100%';
  chat_message.style.height = '100%';
  chat_message.style.paddingRight = '20px';
  chat_message.style.marginTop = '-24px';
  chat_message.style.overflowY = 'auto';
  chat_message.style.fontSize = CONFIGURATION.fontSize;
  chat_message.style.fontFamily = CONFIGURATION.fontFamily;

  var chat_input = document.createElement('input');
  chat_input.type = 'text';
  chat_input.style.position = 'absolute';
  chat_input.style.bottom = '0px';
  chat_input.style.width = '100%';
  chat_input.style.fontSize = CONFIGURATION.fontSize;
  chat_input.style.fontFamily = CONFIGURATION.fontFamily;

  chat.appendChild(chat_message);
  chat.appendChild(chat_input);

  document.body.appendChild(chat);

  this.changeConfiguration = function(key, value) {
    CONFIGURATION[key] = value;
  }

  this.receiveMessage = function(data) {
    chat_message.innerHTML += '<span style="display:block"><strong>' + data.nickname + '</strong>: ' + data.message + '</span>';
    chat_message.scrollTop = chat_message.scrollHeight;
  }

  chat_input.addEventListener('keydown', function(event, a){
    if(event.keyCode == 13 && chat_input.value) {
      that.receiveMessage({nickname: 'EU', message: chat_input.value});
      that.emitter_send_message(chat_input.value);
      chat_input.value = '';
    }
  });
}

function Control(keyboardBind, mouseBind) {
  var HOTKEYS = [];
  HOTKEYS[65] = 'LEFT';
  HOTKEYS[83] = 'DOWN';
  HOTKEYS[68] = 'RIGHT';
  HOTKEYS[87] = 'UP';

  document.body.onkeydown = function(e) {
    var keyCode = e.keyCode;
    
    if(HOTKEYS[keyCode]) keyboardBind(HOTKEYS[keyCode]);
  }

  document.body.oncontextmenu = function(e) { e.preventDefault(); mouseBind('RIGHT'); }
  document.body.onclick = function(e){ e.preventDefault(); mouseBind('LEFT'); }
}


function Map(id) {
  var that = this;
  var map_id = id;

  this.materials = [];
  this.camera = new Camera();
  this.scene = new THREE.Scene();
  this.chat = new Chat();
  
  this.clearColor = 0x7B9EFF;
  this.gravity = {x: 0, y: -1};
  this.player = null;
  this.players = [];
  this.enemies = [];
  this.backgrounds = [];
  this.npcs = [];

  this.load = function() {
    that.camera.setPosition(0, 0, 700);

    var data = {
      'name': "Mapa 01",
      'width': 700,
      'height': 200,
      'collisions': [],
      'materials': [{
        'id': 'tile_0',
        'sprite': 'tile_0.png',
        'effects': null
      }],
      'tiles': [
        { 'x': 0, 'y': 0, 'material': 'tile_0' },
        { 'x': 0, 'y': 35, 'material': 'tile_0' },
        { 'x': 0, 'y': 70, 'material': 'tile_0' },
        { 'x': 0, 'y': 105, 'material': 'tile_0' },
        { 'x': 0, 'y': 140, 'material': 'tile_0' },
        { 'x': 0, 'y': 175, 'material': 'tile_0' },
        { 'x': 0, 'y': 210, 'material': 'tile_0' },
        { 'x': 0, 'y': 245, 'material': 'tile_0' },
        { 'x': 0, 'y': 280, 'material': 'tile_0' },
        { 'x': 0, 'y': 315, 'material': 'tile_0' },
        { 'x': 0, 'y': 350, 'material': 'tile_0' },
        { 'x': 0, 'y': 385, 'material': 'tile_0' },
        { 'x': 0, 'y': 420, 'material': 'tile_0' },
        { 'x': 0, 'y': 455, 'material': 'tile_0' },
        { 'x': 0, 'y': 490, 'material': 'tile_0' },
        { 'x': 0, 'y': 525, 'material': 'tile_0' },

        { 'x': 140, 'y': 105, 'material': 'tile_0' },
        { 'x': 140, 'y': 105, 'material': 'tile_0' },
        { 'x': 175, 'y': 105, 'material': 'tile_0' },

        { 'x': 35, 'y': 0, 'material': 'tile_0' },
        { 'x': 70, 'y': 0, 'material': 'tile_0' },
        { 'x': 105, 'y': 0, 'material': 'tile_0' },
        { 'x': 140, 'y': 0, 'material': 'tile_0' },
        { 'x': 175, 'y': 0, 'material': 'tile_0' },
        { 'x': 210, 'y': 0, 'material': 'tile_0' },
        { 'x': 245, 'y': 0, 'material': 'tile_0' },
        { 'x': 280, 'y': 0, 'material': 'tile_0' },
        { 'x': 315, 'y': 0, 'material': 'tile_0' },
        { 'x': 350, 'y': 0, 'material': 'tile_0' },
        { 'x': 385, 'y': 0, 'material': 'tile_0' },
        { 'x': 420, 'y': 0, 'material': 'tile_0' },
        { 'x': 455, 'y': 0, 'material': 'tile_0' },
        { 'x': 490, 'y': 0, 'material': 'tile_0' },
        { 'x': 525, 'y': 0, 'material': 'tile_0' },
        { 'x': 560, 'y': 0, 'material': 'tile_0' },
        { 'x': 595, 'y': 0, 'material': 'tile_0' },
        { 'x': 630, 'y': 0, 'material': 'tile_0' },
        { 'x': 665, 'y': 0, 'material': 'tile_0' },
        { 'x': 700, 'y': 0, 'material': 'tile_0' },
        { 'x': 735, 'y': 0, 'material': 'tile_0' },
        { 'x': 770, 'y': 0, 'material': 'tile_0' },
        { 'x': 805, 'y': 0, 'material': 'tile_0' },
        { 'x': 840, 'y': 0, 'material': 'tile_0' },
        { 'x': 875, 'y': 0, 'material': 'tile_0' },
        { 'x': 910, 'y': 0, 'material': 'tile_0' },
        { 'x': 945, 'y': 0, 'material': 'tile_0' },
        { 'x': 980, 'y': 0, 'material': 'tile_0' },
        { 'x': 1015, 'y': 0, 'material': 'tile_0' },
        { 'x': 1050, 'y': 0, 'material': 'tile_0' },
        { 'x': 1085, 'y': 0, 'material': 'tile_0' },
        { 'x': 1120, 'y': 0, 'material': 'tile_0' },
        { 'x': 1155, 'y': 0, 'material': 'tile_0' },
        { 'x': 1190, 'y': 0, 'material': 'tile_0' },
        { 'x': 1225, 'y': 0, 'material': 'tile_0' },
        { 'x': 1260, 'y': 0, 'material': 'tile_0' },
        { 'x': 1295, 'y': 0, 'material': 'tile_0' },
        { 'x': 1330, 'y': 0, 'material': 'tile_0' },
        { 'x': 1365, 'y': 0, 'material': 'tile_0' },
        { 'x': 1400, 'y': 0, 'material': 'tile_0' },
        { 'x': 1435, 'y': 0, 'material': 'tile_0' },
        { 'x': 1470, 'y': 0, 'material': 'tile_0' },
        { 'x': 1505, 'y': 0, 'material': 'tile_0' },
        { 'x': 35, 'y': 525, 'material': 'tile_0' },
        { 'x': 70, 'y': 525, 'material': 'tile_0' },
        { 'x': 105, 'y': 525, 'material': 'tile_0' },
        { 'x': 140, 'y': 525, 'material': 'tile_0' },
        { 'x': 175, 'y': 525, 'material': 'tile_0' },
        { 'x': 210, 'y': 525, 'material': 'tile_0' },
        { 'x': 245, 'y': 525, 'material': 'tile_0' },
        { 'x': 280, 'y': 525, 'material': 'tile_0' },
        { 'x': 315, 'y': 525, 'material': 'tile_0' },
        { 'x': 350, 'y': 525, 'material': 'tile_0' },
        { 'x': 385, 'y': 525, 'material': 'tile_0' },
        { 'x': 420, 'y': 525, 'material': 'tile_0' },
        { 'x': 455, 'y': 525, 'material': 'tile_0' },
        { 'x': 490, 'y': 525, 'material': 'tile_0' },
        { 'x': 525, 'y': 525, 'material': 'tile_0' },
        { 'x': 560, 'y': 525, 'material': 'tile_0' },
        { 'x': 595, 'y': 525, 'material': 'tile_0' },
        { 'x': 630, 'y': 525, 'material': 'tile_0' },
        { 'x': 665, 'y': 525, 'material': 'tile_0' },
        { 'x': 700, 'y': 525, 'material': 'tile_0' },
        { 'x': 735, 'y': 525, 'material': 'tile_0' },
        { 'x': 770, 'y': 525, 'material': 'tile_0' },
        { 'x': 805, 'y': 525, 'material': 'tile_0' },
        { 'x': 840, 'y': 525, 'material': 'tile_0' },
        { 'x': 875, 'y': 525, 'material': 'tile_0' },
        { 'x': 910, 'y': 525, 'material': 'tile_0' },
        { 'x': 945, 'y': 525, 'material': 'tile_0' },
        { 'x': 980, 'y': 525, 'material': 'tile_0' },
        { 'x': 1015, 'y': 525, 'material': 'tile_0' },
        { 'x': 1050, 'y': 525, 'material': 'tile_0' },
        { 'x': 1085, 'y': 525, 'material': 'tile_0' },
        { 'x': 1120, 'y': 525, 'material': 'tile_0' },
        { 'x': 1155, 'y': 525, 'material': 'tile_0' },
        { 'x': 1190, 'y': 525, 'material': 'tile_0' },
        { 'x': 1225, 'y': 525, 'material': 'tile_0' },
        { 'x': 1260, 'y': 525, 'material': 'tile_0' },
        { 'x': 1295, 'y': 525, 'material': 'tile_0' },
        { 'x': 1330, 'y': 525, 'material': 'tile_0' },
        { 'x': 1365, 'y': 525, 'material': 'tile_0' },
        { 'x': 1400, 'y': 525, 'material': 'tile_0' },
        { 'x': 1435, 'y': 525, 'material': 'tile_0' },
        { 'x': 1470, 'y': 525, 'material': 'tile_0' },
        { 'x': 1505, 'y': 525, 'material': 'tile_0' },

        { 'x': 1505, 'y': 0, 'material': 'tile_0' },
        { 'x': 1505, 'y': 35, 'material': 'tile_0' },
        { 'x': 1505, 'y': 70, 'material': 'tile_0' },
        { 'x': 1505, 'y': 105, 'material': 'tile_0' },
        { 'x': 1505, 'y': 140, 'material': 'tile_0' },
        { 'x': 1505, 'y': 175, 'material': 'tile_0' },
        { 'x': 1505, 'y': 210, 'material': 'tile_0' },
        { 'x': 1505, 'y': 245, 'material': 'tile_0' },
        { 'x': 1505, 'y': 280, 'material': 'tile_0' },
        { 'x': 1505, 'y': 315, 'material': 'tile_0' },
        { 'x': 1505, 'y': 350, 'material': 'tile_0' },
        { 'x': 1505, 'y': 385, 'material': 'tile_0' },
        { 'x': 1505, 'y': 420, 'material': 'tile_0' },
        { 'x': 1505, 'y': 455, 'material': 'tile_0' },
        { 'x': 1505, 'y': 490, 'material': 'tile_0' },
        { 'x': 1505, 'y': 525, 'material': 'tile_0' },

      ],
      'backgrounds': [
        {'id': "bg_0", 'sprite': "bg_0.png", 'x': 700, 'y': 200, 'z': -3},
        {'id': "bg_1", 'sprite': "bg_1.png", 'x': 700, 'y': 200, 'z': -2},

        {'id': "bg_hill_0", 'sprite': "hill.png", 'width': 1200, 'height': 610, 'x': -150, 'y': -200, 'z': -4},
        {'id': "bg_hill_1", 'sprite': "hill.png", 'width': 1200, 'height': 610, 'x': 900, 'y': -200, 'z': -4},

        {'id': "bg_pilar_0", 'sprite': "pillar.png", 'width': 183, 'height': 300, 'x': 663, 'y': 18, 'z': -2},

        {'id': "bg_crystal_0", 'sprite': "crystal.png", 'width': 97, 'height': 80, 'x': 700, 'y': 320, 'z': -2},

        {'id': "bg_cloud_0", 'sprite': "cloud.png", 'width': 97, 'height': 80, 'x': 200, 'y': 410, 'z': -3},
        {'id': "bg_cloud_1", 'sprite': "cloud.png", 'width': 97, 'height': 80, 'x': 500, 'y': 510, 'z': -3},
        {'id': "bg_cloud_2", 'sprite': "cloud.png", 'width': 97, 'height': 80, 'x': 800, 'y': 390, 'z': -3},
        {'id': "bg_cloud_3", 'sprite': "cloud.png", 'width': 97, 'height': 80, 'x': 1100, 'y': 340, 'z': -3},
        {'id': "bg_cloud_4", 'sprite': "cloud.png", 'width': 97, 'height': 80, 'x': 1300, 'y': 470, 'z': -3},
      ],
      'npcs': [],
    }

    that.tiles = data.tiles;

    that.build(data.materials, data.tiles, data.collisions, data.backgrounds);
  }

  this.update = function() {
    that.camera.update();
    that.player.update();

    for(var i in that.players) {
      that.players[i].update();
    }
  }

  /* ADICIONAR ELEMENTOS */

  this.addPlayer = function(player) {
    that.player = player;
    that.camera.follow(that.player, -17.5, -17.5, 1522.5, 532.5);

    that.scene.add(player);
  }
  this.addOtherPlayer = function(player) {
    that.players[player.nickname] = new Player();
    that.players[player.nickname].setName(player.nickname);
    that.players[player.nickname].position.set(player.x, player.y, 0);

    that.scene.add(that.players[player.nickname]);
  }
  this.updateOtherPlayer = function(player) {
    if(!that.players[player.nickname]) that.addOtherPlayer(player);// Provisorio até vim a lista de personagens no JOIN

    that.players[player.nickname].moveTo(player.x, player.y);
  }
  this.deleteOtherPlayer = function(player) {
    that.scene.remove(that.players[player.nickname]);
    delete that.players[player.nickname];
  }
  this.addEnemy = function(enemy) {}
  this.addNPC = function(NPC) {}
  this.addBackground = function(background) {
    var texture = new THREE.ImageUtils.loadTexture('resources/backgrounds/' + background.sprite),
        material = new THREE.MeshBasicMaterial({map: texture, transparent: true}),
        mesh = new THREE.Mesh(new THREE.PlaneGeometry(background.width, background.height), material);

    texture.minFilter = THREE.LinearFilter;

    mesh.position.set(background.x + background.width/2, background.y + background.height/2, background.z);

    that.scene.add(mesh); 
  }
  this.addTeleport = function() {}
  this.addTile = function(tile) {
      var texture = that.materials[tile.material],
          material  = new THREE.MeshBasicMaterial({map: texture}),
          mesh = new THREE.Mesh(new THREE.PlaneGeometry(35, 35), material);

      mesh.position.set(tile.x, tile.y, -1);

      that.scene.add(mesh);
  }

  this.build = function(materials, tiles, collisions, backgrounds) {
    for(var material of materials) {
      let texture = new THREE.ImageUtils.loadTexture('resources/tiles/' + material.sprite);
      texture.minFilter = THREE.LinearFilter;
      that.materials[material.id] = texture;
    }
    
    for(var tile of tiles) {
      that.addTile(tile);
    }

    for(var background of backgrounds) {
      that.addBackground(background);
    }
  }

  this.getCamera = function() { return that.camera; }
  this.getScene = function() { return that.scene; }

  this.hasCollision = function(x, y, h, w) {
    var SIZE = 35, WIDTH = 10;
    var collisions = [];

    for(var tile of that.tiles){
      var L = tile.x, R = tile.x+SIZE, U = tile.y, D = tile.y-SIZE;

      var detect = ((x<L && x+w < L) || (x > R)) || ((y-h > U) || (y < D));
      if( !detect ) return true;
    }

    return false;
  }
}

function Player(name) {
  var that = this;
  var texture = new THREE.ImageUtils.loadTexture('resources/player.png'),
      material = new THREE.MeshBasicMaterial({color: 0xfff, map: texture}),
      geometry = new THREE.PlaneGeometry(35, 35),
      mesh = new THREE.Mesh(geometry, material);

 
  var new_position = {x:300, y:45, z:0};
  mesh.velocity = 5;
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
    delta = 0.2
    new_position.x = x;
    new_position.y = y;
  }

  mesh.setName = function(name) { 
    that.name = name;
    that.textName = new Text(name);
    mesh.add(that.textName);
  }

  mesh.getName = function() { return that.name; }
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

function Text(text) {
  var fontface = "Arial";
  var fontsize = 38;

  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.font = "Bold " + fontsize + "px " + fontface;

  var metrics = context.measureText( text );
  var width = metrics.width;

  context.fillStyle = "rgba(0, 0, 0, 1.0)";
  context.fillText(text, (canvas.width - width)/2, fontsize);

  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  var spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  var sprite = new THREE.Sprite( spriteMaterial );
  sprite.scale.set(100, 50, 1.0);
  //sprite.position.x += width/2;
  sprite.position.y += 10;

  return sprite;
}

function Game(sceneManager, game) {
  var that = this; 

  this.bugReport = new BugReport(game.renderer, game.network.sendBug);

  this.map = new Map('map_id');
  this.camera = this.map.getCamera();
  this.scene = this.map.getScene();

  this.player = new Player();
  this.player.setName(nickname);

  game.renderer.setClearColor(this.map.clearColor, 1);
  game.renderer.setSize(window.innerWidth, window.innerHeight);

  game.network.hook_receive_message(that.map.chat.receiveMessage);

  game.network.hook_join(this.map.addOtherPlayer);
  game.network.hook_movement(this.map.updateOtherPlayer);
  game.network.hook_leave(this.map.deleteOtherPlayer);

  this.map.chat.emitter_send_message = game.network.sendChat;

  this.control = new Control(keyboardBind, this.player.mouseBind);

  this.map.addPlayer(this.player);
  this.map.load();

  function keyboardBind(key) {
    if( key ==  'LEFT' && !that.map.hasCollision(that.player.getPosition().x-that.player.velocity, that.player.getPosition().y, 35, 35)) {
      that.player.moveX(-1);
    }
    if(key == 'RIGHT' && !that.map.hasCollision(that.player.getPosition().x+that.player.velocity, that.player.getPosition().y, 35, 35)) {
      that.player.moveX(1);
    }
    if(key == 'UP' && !that.map.hasCollision(that.player.getPosition().x, that.player.getPosition().y+that.player.velocity, 35, 35)) {
      that.player.moveY(1);
    }
    if(key == 'DOWN' && !that.map.hasCollision(that.player.getPosition().x, that.player.getPosition().y-that.player.velocity, 35, 35)) {
      that.player.moveY(-1);
    }
  }

  mouseBind = function(mouse) { }

  var timeToUpdate = 0;

  this.update = function(){
    that.map.update();

    for(var n in that.players) {
      that.players[n].update()
    }

    if(timeToUpdate > 2) {
      timeToUpdate = 0;
      game.network.sendMovement(that.player.position.x, that.player.position.y);
    }

    timeToUpdate+=0.4;
  }
  this.up = function(){}
  this.down = function(){}
}

function Initialize(sceneManager, game) {
  this.camera = new THREE.PerspectiveCamera(60, window.devicePixelRatio, 0.1, 2000);
  this.scene = new THREE.Scene();

  this.camera.position.set(0, 0, 700);
  game.renderer.setClearColor(0x000, 1);
  game.renderer.setSize(window.innerWidth, window.innerHeight);

  // ToDo - Precisa da lista de arquivos para download...
  var data = [
    { filename: 'resources/maps/map_01.json', type: 'json'},
    { filename: 'resources/player.png'      , type: 'image'},
  ];


  var logo = document.createElement('img');
  logo.src = 'resources/logo.png';
  logo.style.position = 'fixed';
  logo.style.width = '30%';
  logo.style.top = '10%';
  logo.style.left = '35%';

  // ToDo - criar um gerador de texto
  var text_1 = document.createElement('h1');
  text_1.style.position = 'fixed';
  text_1.style.color = 'white';
  text_1.style.bottom = '10%';
  text_1.style.width = '100%';
  text_1.style.textAlign = 'center';
  text_1.innerHTML = 'Carregando...';

  var text = document.createElement('h1');
  text.style.position = 'fixed';
  text.style.color = 'white';
  text.style.bottom = '5%';
  text.style.width = '100%';
  text.style.fontSize = '12px';
  text.style.textAlign = 'center';

  // ToDo - Criar um progress bar
  var progress = document.createElement('div');
  progress.style.position = 'fixed';
  progress.style.height = '20px';
  progress.style.bottom = '10%';
  progress.style.width = '40%';
  progress.style.margin = '0 30%';
  progress.style.backgroundColor = '#444';
  progress.style.border = '1px solid white';

  var progress_bar = document.createElement('div');
  progress_bar.style.height = '100%';
  progress_bar.style.backgroundColor = 'red';
  progress_bar.style.width = '0%';
  progress.appendChild(progress_bar);

  document.body.appendChild(logo);
  document.body.appendChild(text_1);
  document.body.appendChild(text);
  document.body.appendChild(progress);

  function UI_ChangeFilenameRequest(filename) {
    text.innerHTML = filename;
  }

  function UI_ChangeProgress(p) {
    progress_bar.style.width = p+'%';
  }

  function LoaderFiles(files) {
    var queue_files = files.slice(),
        queue_current;

    var queue_finish = function() {
      sceneManager.next();
    },
    queue_next = function() {
      queue_current = queue_files.shift(); 

      if(!queue_current) { queue_finish(); return; }

      setTimeout(function() {queue_request(queue_current.filename, queue_current.type); }, 1000);
    },
    queue_downloading = function(xhr) {
      console.log( (xhr.loaded / xhr.total * 100) + '% percents.' );
    },
    queue_fail = function(xhr) {
      console.log('fail');
    },
    queue_request = function(filename, type) {
      THREE.Cache.enabled = true;
      var loader;

      if(type == 'image') 
        loader = new THREE.ImageLoader();
      else 
        loader = new THREE.FileLoader();

      UI_ChangeFilenameRequest(filename);
      UI_ChangeProgress(parseInt((files.length - queue_files.length) / files.length * 100) );

      loader.load(filename, queue_next, queue_downloading, queue_fail);
    }

    queue_next();
  }

  this.up = function() {
    LoaderFiles(data);
  }

  this.down = function() {
    logo.remove();
    text.remove();
    text_1.remove();
    progress.remove();
  }

  this.update = function(){}
}

function Login(sceneManager, game) {
  this.camera = new THREE.PerspectiveCamera(75, window.devicePixelRatio, 0.1, 2000);
  this.scene = new THREE.Scene();

  nickname = 'no-name';

  this.camera.position.set(0, 0, 100);
  game.renderer.setClearColor(0x000, 1);

  function onTryConnect() {
    CreateStatus();
    StatusConnecting();

    game.network.hook_server_connect(onConnect);
    setTimeout(game.network.connect, 1000);
  }

  function onConnect() {
    StatusConnected();
    CreateForm();
  }

  function onTryLogin() {
    game.network.hook_login_account(onLogin, onFailLogin);
    game.network.loginAccount(nickname, nickname);
  }

  function onLogin() {
    game.network.hook_load_character(onLoadCharacter);
    game.network.loadCharacter(nickname);
  }
  
  function onFailLogin() {
    StatusFailConnection();
  }

  function onLoadCharacter() {
    sceneManager.next();
  }

  var login = document.createElement('input');
  var login_text = document.createElement('h1');
  var login_button = document.createElement('button');
  var login_status = document.createElement('h1');

  function CreateStatus() {
    login_status.style.position = 'fixed';
    login_status.style.top = '50%';
    login_status.style.width = '100%';
    login_status.style.fontSize = '15px';
    login_status.style.textAlign = 'center';

    document.body.appendChild(login_status);
  }

  function StatusConnecting() {
    login_status.style.color = 'green';
    login_status.innerHTML = 'Conectando ao servidor...';
  }

  function StatusConnected() {
    login_status.style.color = 'green';
    login_status.innerHTML = 'Conectado!';
  }

  function StatusFailConnection() {
    login_status.style.color = 'red';
    login_status.innerHTML = 'Sem conexão!';
  }

  function CreateForm() {
    login.style.position = 'fixed';
    login.style.width = '30%';
    login.style.top = '30%';
    login.style.left = '35%';
    login.style.fontSize = '32px';
    login.style.textAlign = 'center';

    login_text.style.position = 'fixed';
    login_text.style.width = '30%';
    login_text.style.top = '20%';
    login_text.style.left = '35%';
    login_text.style.textAlign = 'center';
    login_text.style.color = 'white';
    login_text.innerHTML = 'Seu nick';

    login_button.style.position = 'fixed';
    login_button.style.width = '30%';
    login_button.style.top = '40%';
    login_button.style.left = '35%';
    login_button.style.textAlign = 'center';
    login_button.style.fontSize = '26px';
    login_button.innerHTML = 'Entrar';

    document.body.appendChild(login);
    document.body.appendChild(login_text);
    document.body.appendChild(login_button);

    login_button.addEventListener('click', onSubmit, false);
    login.addEventListener('keydown', function(e) { if(e.keyCode == 13) { onSubmit(); } }, false);

    function onSubmit(){
      nickname = login.value;
      onTryLogin();
    }

    login.focus();
  }

  this.up = function() {
    onTryConnect();
  }

  this.down = function() {
    login.remove();
    login_text.remove();
    login_button.remove();
    login_status.remove();
  }
 
  this.update = function(){}
}

function Splash(sceneManager, game) {
  this.camera = new THREE.PerspectiveCamera(75, window.devicePixelRatio, 0.1, 2000);
  this.scene = new THREE.Scene();

  this.camera.position.set(0, 0, 100);
  game.renderer.setClearColor(0x0F0, 1);

  this.up = function() {
    setTimeout(function(){ sceneManager.next(); }, 300);
  }

  this.down = function() {}

  this.update = function(){}
}


function GameNetwork(options) {
  var that = this;

  var network = new Network();
  var urlWS = network.createURL(window.location.protocol, window.location.host)  + '/ws';
  var callbacks = [];

  this.connect = function() {
    network.connect(urlWS);
    network.setCallback(onOpen, onMessage, onClose);
  }

  /* WEBSOCKET FUNCTION's */
  function onOpen(response) {
    invoke('connect', true);
  }
  function onError(response) { }
  function onClose() {
    console.log("WS - Close");
    invoke('close', true);
  }
  function onMessage(response) {
    var data = JSON.parse(response.data);

    switch(data.action)
    {
      case 'connect': invoke('connect', data); break;
      case 'disconnect': invoke('disconnect', data); break;
      case 'login_account_success': invoke('login_success', data); break;
      case 'login_account_fail': invoke('login_fail', data); break;
      case 'load_character': invoke('load_character', data); break;
      case 'join': invoke('join', data); break;
      case 'leave': invoke('leave', data); break;
      case 'chat': invoke('receive_message', data); break;
      case 'movement': invoke('movement', data); break;
    }
  }

  /* HOOK's */
  this.hook_server_connect = function(callback) {
    callbacks['connect'] = callback;
  }
  this.hook_server_disconnect = function(callback) {
    callbacks['disconnect'] = callback;
  }
  this.hook_login_account = function(callback_success, callback_fail) {
    callbacks['login_success'] = callback_success;
    callbacks['login_fail'] = callback_fail;
  }
  this.hook_load_character = function(callback) {
    callbacks['load_character'] = callback;
  }
  this.hook_join = function(callback) {
    callbacks['join'] = callback;
  }
  this.hook_leave = function(callback) {
    callbacks['leave'] = callback;
  }
  this.hook_receive_message = function(callback) {
    callbacks['receive_message'] = callback;
  }
  this.hook_movement = function(callback) {
    callbacks['movement'] = callback;
  }

  /* FUNCTIONS */
  this.loginAccount = function(login, senha) {
    send({action: 'login_account', login: login, senha: senha});
  }
  this.loadCharacter = function(character_id) {
    send({action: 'load_character', character_id: character_id});
  }
  this.sendChat = function(message) {
    send({action: 'chat', message: message});
  }
  this.sendMovement = function(x, y) {
    send({action: 'movement', x: x, y: y})
  }
  this.sendBug = function(data, text) {
    send({action: 'bug', screen: data, text: text})
  }

  /* INTERNAL FUNCTION */
  function send(data) {
    network.send(JSON.stringify(data));
  }
  function invoke(callback_name, data) {
    var f = callbacks[callback_name];
    !!f && f(data);
  }

}

function Network() {
  var websocket;

  this.createURL = function(protocol, host) {
    protocol = (protocol == 'http:' ? 'ws' : 'wss') + '://';
    
    return protocol + host;
  }

  this.connect = function(url) {
    if(!websocket || (websocket instanceof WebSocket && websocket.readyState == WebSocket.CLOSED)) {
      websocket = new WebSocket(url);
    }
  }

  this.setCallback = function(onopen, onmessage, onclose) {
    websocket.onopen = onopen;
    websocket.onmessage = onmessage;
    websocket.onclose = onclose; 
  }

  this.state = function() {
    if(!websocket || !(websocket instanceof WebSocket)) {
      return null;
    }

    return websocket.readyState;
  }

  this.send = function(data) {
    if(!websocket || !(websocket instanceof WebSocket)) {
      return;
    }
      
    websocket.send(data);
  }
}

(function(){
var stats = new Stats();
var clock = new THREE.Clock();
var renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});

renderer.setClearColor(0x000, 1);
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(stats.dom);
document.body.appendChild(renderer.domElement);

// Basic itens
var BASIC_CAMERA = new THREE.PerspectiveCamera(75, window.devicePixelRatio, 0.1, 2000);

var network = new GameNetwork();
var sceneManager = new SceneManager({'renderer': renderer, 'network': network});

function SceneManager(game) {
  this.scenes = [Initialize, Splash, Login, Game];
  this.scenesIndex= 0;

  this.initialize = function() {
    this.next();
  }

  this.next = function() {
    var scene = this.scenes[this.scenesIndex++ % this.scenes.length];
    this.change(scene);
  }
    
  this.change = function(scene) {
    if(this.current) this.current.down();

    this.current =  new scene(this, game);
    this.current.up();
  }

  this.initialize();
}

function animate(){
  requestAnimationFrame(animate);
  render();
  update();
}


function update(){
  stats.update();
  sceneManager.current.update();
}

function render(){
  renderer.render(sceneManager.current.scene, sceneManager.current.camera);
}

animate();

}());
