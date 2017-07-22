function Map(id) {
  var that = this;
  var map_id = id;

  this.materials = [];
  this.camera = new Camera();
  this.scene = new THREE.Scene();
  this.chat = new Chat();
  this.chat.hookMessage = function() {
    console.log('send message from chat');
  } 
  
  this.clearColor = 0x7B9EFF;
  this.gravity = {x: 0, y: -1};
  this.player = null;
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

  }

  /* ADICIONAR ELEMENTOS */

  this.addPlayer = function(player) {
    that.player = player;
    that.camera.follow(that.player, -17.5, -17.5, 1522.5, 532.5);

    that.scene.add(player);
  }
  this.addEnemy = function(enemy) {}
  this.addNPC = function(NPC) {}
  this.addBackground = function(background) {
    var texture = new THREE.ImageUtils.loadTexture('resources/backgrounds/' + background.sprite),
        material = new THREE.MeshBasicMaterial({map: texture, transparent: true}),
        mesh = new THREE.Mesh(new THREE.PlaneGeometry(background.width, background.height), material);

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
      that.materials[material.id] = new THREE.ImageUtils.loadTexture('resources/tiles/' + material.sprite);
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
