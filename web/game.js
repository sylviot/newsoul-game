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
  this.scenes = [Initialize, Splash, /*Login,*/ Game];
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

/* NETWORK */

function Network() {
  var URL = CreateURL(), 
      websocket,
      callback_open,
      callback_message,
      callback_close;

  function CreateURL() {
    return 'ws://' + window.location.host + '/ws';
  }

  this.connect = function() {
    if(!websocket || (websocket instanceof WebSocket && websocket.readyState == WebSocket.CLOSED)) {
      console.log('Connecting...')
      websocket = new WebSocket(URL);
      websocket.onopen = function(e){console.log('connected!!!')};//callback_open;
      websocket.onmessage = callback_message;
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


/* SCENE */

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

function Game(sceneManager, game) {
  this.camera = new THREE.PerspectiveCamera(75, window.devicePixelRatio, 0.1, 2000);
  this.scene = new THREE.Scene();

  this.camera.position.set(0, 0, 100);
  game.renderer.setClearColor(0x000, 1);

  var that = this;
  this.players = [];
  this.player = new Player( 'player_' + (~~(Math.random()*99999)) );

  game.network.connect();

  game.network.setCallback(onConnected, onMessage, null);

  function onConnected(){
    console.log("Join: " + that.player.getName())
    game.network.send(JSON.stringify({action: 'join', nickname: that.player.getName(), message: 'mensagem'}));
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

  this.timeToUpdate = 0.5;
  this.timeElapsed = 0;

  this.update = function() {
    that.timeElapsed+=clock.getDelta();

    if(that.timeElapsed > that.timeToUpdate) {
      game.network.send(JSON.stringify({'action': 'talk', 'nickname': that.player.getName(), 'message': {'positionX': that.player.position.x, 'positionY': that.player.position.y} }));
      that.timeElapsed = 0;
    }



  }
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

    game.network.send('Login');
    sceneManager.next();
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
    game.network.connect();
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

function Initialize(sceneManager, game) {
  this.camera = new THREE.PerspectiveCamera(60, window.devicePixelRatio, 0.1, 2000);
  this.scene = new THREE.Scene();

  this.camera.position.set(0, 0, 700);
  game.renderer.setClearColor(0x000, 1);
  game.renderer.setSize(window.innerWidth, window.innerHeight);

  // ToDo - Precisa da lista de arquivos para download...
  var data = [
    { filename: 'resources/player.png',       type: 'image'},
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

      setTimeout(function() {queue_request(queue_current.filename, queue_current.type); },100);
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
