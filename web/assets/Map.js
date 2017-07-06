function Map(id) {
  var that = this;
  var map_id = id;

  this.materials = [];
  this.group = new THREE.Group();
  
  this.player = null;
  this.enemies = [];
  this.backgrounds = [];
  this.npcs = [];

  this.load = function() {
    console.log("map load")
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
        { 'x': 35, 'y': 0, 'material': 'tile_0' },
        { 'x': 70, 'y': 0, 'material': 'tile_0' },
        { 'x': 105, 'y': 0, 'material': 'tile_0' },
        { 'x': 140, 'y': 0, 'material': 'tile_0' },
        { 'x': 175, 'y': 0, 'material': 'tile_0' },
        { 'x': 210, 'y': 0, 'material': 'tile_0' },
        { 'x': 245, 'y': 0, 'material': 'tile_0' },
        { 'x': 280, 'y': 0, 'material': 'tile_0' },
        { 'x': 315, 'y': 0, 'material': 'tile_0' },
        { 'x': 315, 'y': 35, 'material': 'tile_0' },
      ],
      'backgrounds': [
        {'id': "bg_0", 'sprite': "bg_0.png", 'width': 700, 'height': 200, 'z': -3},
        {'id': "bg_1", 'sprite': "bg_1.png", 'width': 700, 'height': 200, 'z': -2},
      ],
      'npcs': [],
    }

    that.tiles = data.tiles;

    that.build(data.materials, data.tiles, data.collisions, data.backgrounds);
  }

  this.addPlayer = function(player) {
    that.player = player;

    that.group.add(player);
  }
  this.addEnemy = function(enemy) {}
  this.addNPC = function(NPC) {}
  this.addBackground = function(background) {
    var texture = new THREE.ImageUtils.loadTexture('resources/backgrounds/' + background.sprite),
        material = new THREE.MeshBasicMaterial({map: texture, transparent: true}),
        mesh = new THREE.Mesh(new THREE.PlaneGeometry(background.width, background.height), material);

    mesh.position.set(0, background.height/2, background.z);

    that.group.add(mesh); 
  }

  this.addTeleport = function() {}

  this.addTile = function(tile) {
      var texture = that.materials[tile.material],
          material  = new THREE.MeshBasicMaterial({map: texture}),
          mesh = new THREE.Mesh(new THREE.PlaneGeometry(35, 35), material);

      mesh.position.set(tile.x, tile.y, -1);

      that.group.add(mesh);
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

  this.getGroup = function() { return that.group; }

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
