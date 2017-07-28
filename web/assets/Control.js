function Control(keyboardBind, mouseBind) {
  var HOTKEYS = [];
  HOTKEYS[65] = 'LEFT';
  HOTKEYS[83] = 'DOWN';
  HOTKEYS[68] = 'RIGHT';
  HOTKEYS[87] = 'UP';

  document.body.onkeydown = function(e) {
    var keyCode = e.keyCode;
    
    if(HOTKEYS[keyCode]) keyboardBind(HOTKEYS[keyCode]);
  }

  document.body.oncontextmenu = function(e) { e.preventDefault(); mouseBind('RIGHT'); }
  document.body.onclick = function(e){ e.preventDefault(); mouseBind('LEFT'); }
}

