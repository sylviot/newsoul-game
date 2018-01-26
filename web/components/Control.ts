import { IScene } from './Interface'

export class Control {
  private _hotkeys: Array<string>

  constructor(_scene: IScene) {
    this._hotkeys = new Array<string>()
    
    document.body.onkeydown = (_event) => { 
      let hotkey = this._hotkeys[_event.keyCode]
      
      if (hotkey) {
        _scene._keyboadEvent(hotkey)
      }
    }

    document.body.onmousemove = (_event) => { _scene._mouseEvent({name: 'MOVE', x: _event.clientX, y: _event.clientY}) }
    document.body.oncontextmenu = (_event) => { _event.preventDefault(); _scene._mouseEvent('RIGHT CLICK') }
    document.body.onclick = (_event) => { _event.preventDefault(); _scene._mouseEvent('LEFT CLICK') }
  }

  loadDefaultHotkeys(_data: any) {
    _data.forEach(item => {
      this._hotkeys[item.code] = item.action
    });
  }
}