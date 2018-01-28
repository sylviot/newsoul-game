import { IScene } from './Interface'

export class Control {
  private _hotkeys: Array<number>
  private _keys: Array<boolean>

  constructor(_scene: IScene) {
    this._hotkeys = new Array<number>()
    this._keys = new Array<boolean>()
    
    document.body.onkeydown = (_event) => { 
      this._keys[_event.keyCode] = true
    }

    document.body.onkeyup = (_event) => {
      this._keys[_event.keyCode] = false
    }

    document.body.onmousemove = (_event) => { _scene._mouseEvent({name: 'MOVE', x: _event.clientX, y: _event.clientY}) }
    document.body.oncontextmenu = (_event) => { _event.preventDefault(); _scene._mouseEvent('RIGHT CLICK') }
    document.body.onclick = (_event) => { _event.preventDefault(); _scene._mouseEvent('LEFT CLICK') }
  }

  isPressed(_hotkey: string): boolean {
    let _hotkeyCode = this._hotkeys[_hotkey]

    return ( _hotkeyCode && this._keys[_hotkeyCode] )
  }

  loadDefaultHotkeys(_data: any) {
    _data.forEach(item => {
      this._hotkeys[item.action] = item.code
    });
  }
}