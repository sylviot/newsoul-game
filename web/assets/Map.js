function Map(id) {
  var that = this;
  this.materials = [];
  this.group = new THREE.Group();
  
  var map_id = id;

  this.load = function() {
    console.log("map load")
    var data = {
      'name': "Mapa 01",
      'width': 100,
      'height': 30,
      'collisions': [],
      'materials': [{
        'id': 'tile_0',
        'sprite': 'tile_0.png',
        'effects': null
      }],
      'tiles': [
        { 'x': -315, 'y': 70, 'material': 'tile_0' },
        { 'x': -315, 'y': 35, 'material': 'tile_0' },
        { 'x': -315, 'y': 0, 'material': 'tile_0' },
        { 'x': -280, 'y': 0, 'material': 'tile_0' },
        { 'x': -245, 'y': 0, 'material': 'tile_0' },
        { 'x': -210, 'y': 0, 'material': 'tile_0' },
        { 'x': -175, 'y': 0, 'material': 'tile_0' },
        { 'x': -140, 'y': 0, 'material': 'tile_0' },
        { 'x': -105, 'y': 0, 'material': 'tile_0' },
        { 'x': -70, 'y': 0, 'material': 'tile_0' },
        { 'x': -35, 'y': 0, 'material': 'tile_0' },
        { 'x': 0, 'y': 0, 'material': 'tile_0' },
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
        { 'x': 315, 'y': 70, 'material': 'tile_0' },
      ],
    }

    that.build(data.materials, data.tiles, data.collisions);
  }

  this.addPlayer = function(player) {}
  this.addEnemy = function(enemy) {}
  this.addNPC = function(NPC) {}
  this.addBackground = function(background) {}

  this.build = function(materials, tiles, collisions) {
    for(var material of materials) {
      that.materials[material.id] = new THREE.ImageUtils.loadTexture('resources/tiles/' + material.sprite);
    }
    
    for(var tile of tiles) {
      var material = new THREE.MeshBasicMaterial({map: that.materials[tile.material]});
      var mesh = new THREE.Mesh(new THREE.PlaneGeometry(35, 35), material);
      mesh.position.set(tile.x, tile.y, 0);
      that.group.add(mesh);
    }
  }

  this.getGroup = function() { return that.group; }
}
