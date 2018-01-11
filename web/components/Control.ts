export class Control {
  private _hotkeys: Array<string>

  constructor(_onKeyboardBind, _onMouseBind) {
    this._hotkeys = new Array<string>()
    
    let that = this

    document.body.onkeydown = function(_event){ 
      console.log(_event.keyCode)
      let hotkey = that._hotkeys[_event.keyCode]
      if(hotkey)
        _onKeyboardBind(hotkey)
    }
    
    
    // document.body.onmouseover = function(_event){ that.mouseEvent(_event) })
    document.body.oncontextmenu = function(_event) { _event.preventDefault(); _onKeyboardBind('RIGHT CLICK') }
    document.body.onclick = function(_event){ _event.preventDefault(); _onKeyboardBind('LEFT CLICK') }
  }

  loadDefaultHotkeys(_data: any) {
    _data.forEach(item => {
      this._hotkeys[item.code] = item.action
    });
  }
}