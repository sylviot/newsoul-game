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
