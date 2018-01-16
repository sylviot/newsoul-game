import { IScene } from './Interface'

export class Control {
  private _hotkeys: Array<string>

  constructor(_scene: IScene) {
    this._hotkeys = new Array<string>()
    
    let that = this

    document.body.onkeydown = function(_event){ 
      let hotkey = that._hotkeys[_event.keyCode]
      
      if(hotkey)
        _scene._keyboadEvent(hotkey)
    }
    
    
    // document.body.onmouseover = function(_event){ that.mouseEvent(_event) })
    document.body.oncontextmenu = function(_event) { _event.preventDefault(); _scene._mouseEvent('RIGHT CLICK') }
    document.body.onclick = function(_event){ _event.preventDefault(); _scene._mouseEvent('LEFT CLICK') }
  }

  loadDefaultHotkeys(_data: any) {
    _data.forEach(item => {
      this._hotkeys[item.code] = item.action
    });
  }
}