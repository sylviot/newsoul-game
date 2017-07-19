function Network() {
  var URL = CreateURL(), 
      websocket;

  function CreateURL() {
    return 'wss://' + window.location.host + '/ws';
  }

  this.connect = function() {
    if(!websocket || (websocket instanceof WebSocket && websocket.readyState == WebSocket.CLOSED)) {
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
