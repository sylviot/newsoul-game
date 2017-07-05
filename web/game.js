function Enemy(id) {

}

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
        { 'x': 70, 'y': 35, 'material': 'tile_0' },
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
      'backgrounds': [
        {'id': "bg_0", 'sprite': "bg_0.png", 'width': 700, 'height': 200, 'z': -3},
        {'id': "bg_1", 'sprite': "bg_1.png", 'width': 700, 'height': 200, 'z': -2},
      ],
      'npcs': [],
    }

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

  this.update = function() {

  }
}


function Player(name) {
  var texture = new THREE.ImageUtils.loadTexture('resources/player.png'),
      material = new THREE.MeshBasicMaterial({color: 0xfff, map: texture}),
      geometry = new THREE.PlaneGeometry(32, 32),
      mesh = new THREE.Mesh(geometry, material);

  var VELOCITY = 3.5;

  mesh.position.set(15, 35, 0);

  mesh.moveX = function(side){
    if(side == -1) mesh.position.x-=VELOCITY;
    if(side == 1) mesh.position.x+=VELOCITY;
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

function Game(sceneManager, game) {
  this.camera = new THREE.PerspectiveCamera(75, window.devicePixelRatio, 0.1, 2000);
  this.scene = new THREE.Scene();

  this.camera.position.set(0, 0, 100);
  game.renderer.setClearColor(0x000, 1);

  var that = this;
  this.players = [];
  this.player = new Player( 'player_' + (~~(Math.random()*99999)) );

  //game.network.connect();
  game.network.setCallback(onConnected, onMessage, null);

  function onConnected(){
    console.log("Join: " + that.player.getName())
    //game.network.send(JSON.stringify({action: 'join', nickname: that.player.getName(), message: 'mensagem'}));
  }

  function onMessage(e) {
    var data = JSON.parse(e.data);
    
    if(data.nickname != that.player.getName() && !that.players[data.nickname]) {
      that.players[data.nickname] = new Player(data.nickname);
      that.scene.add(that.players[data.nickname]);
    }

    if(data.action == 'talk' && data.nickname != that.player.getName()) {
      that.players[data.nickname].moveTo(data.content.positionX, data.content.positionY);
    }

    if(data.action == 'leave' && that.players[data.nickname]) {
      that.scene.remove(that.players[data.nickname]);
      delete that.players[data.nickname];
    }
  };

  this.scene.add(this.player);

  window.addEventListener('keydown', onKeydown, false);

  function onKeydown(e) {
    var key = e.keyCode;

    /* A */if(key == 65) that.player.moveX(-1);
    /* D */if(key == 68) that.player.moveX(1);
    /* S */if(key == 83) that.player.moveY(-1);
    /* W */if(key == 87) that.player.moveY(1);
  }

  this.up = function() { }

  this.down = function() { }

  this.timeToUpdate = 0.2;
  this.timeElapsed = 0;

  this.update = function() {
    that.timeElapsed+=clock.getDelta();

    if(that.timeElapsed > that.timeToUpdate) {
      game.network.send({'action': 'talk', 'nickname': that.player.getName(), 'message': {'positionX': that.player.position.x, 'positionY': that.player.position.y} });
      that.timeElapsed = 0;
    }
  }
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
    text.remove();
    text_1.remove();
    progress.remove();
  }

  this.update = function(){}
}

function Login(sceneManager, game) {
  this.camera = new THREE.PerspectiveCamera(75, window.devicePixelRatio, 0.1, 2000);
  this.scene = new THREE.Scene();

  this.camera.position.set(0, 0, 100);
  game.renderer.setClearColor(0x000, 1);

  function onLogin(){
    if(!login.value) {
      login.focus();
      return;
    }

    game.network.connect();
    game.network.setCallback(function() {
      console.log('Login connect!');
      game.network.send({action: 'join', nickname: login.value});
    }, function(data) {
      console.log('Data:', data);
      sceneManager.next();
    }, null);
  }

  var login = document.createElement('input');
  var login_text = document.createElement('h1');
  var login_button = document.createElement('button');

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

    login_button.addEventListener('click', onLogin, false);
    login.addEventListener('keydown', function(e) {
      if(e.keyCode == 13) {
        onLogin();
      }
    }, false);

    login.focus();
  }

  this.up = function() {
    CreateForm();
  }

  this.down = function() {
    login.remove();
    login_text.remove();
    login_button.remove();
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


function Network() {
  var URL = CreateURL(), 
      websocket;

  function CreateURL() {
    return 'ws://' + window.location.host + '/ws';
  }

  this.connect = function() {
    if(!websocket || (websocket instanceof WebSocket && websocket.readyState == WebSocket.CLOSED)) {
      console.log('Connecting...')
      websocket = new WebSocket(URL);
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
      
    websocket.send(JSON.stringify(data));
  }
}

var stats = new Stats();
var clock = new THREE.Clock();
var renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setClearColor(0x000, 1);
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(stats.dom);
document.body.appendChild(renderer.domElement);

// Basic itens
var BASIC_CAMERA = new THREE.PerspectiveCamera(75, window.devicePixelRatio, 0.1, 2000);

var network = new Network();
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
