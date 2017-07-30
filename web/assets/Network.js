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
