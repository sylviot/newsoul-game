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
