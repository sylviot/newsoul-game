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
