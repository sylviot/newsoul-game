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

    this.defaultHotkeys()
  }

  customHotkeys(_hotkeys): void {
    _hotkeys.forEach(hk => {
      this._hotkeys[hk.action] = hk.code
    });
  }

  defaultHotkeys(): void {
    var hotkeys = [
      { action:'LEFT', code: 65},
      { action:'DOWN', code: 83},
      { action:'RIGHT', code: 68},
      { action:'UP', code: 87},
      { action:'SPACE', code: 32}
    ];

    this.customHotkeys(hotkeys);
  }

  isPressed(_hotkey: string): boolean {
    let _hotkeyCode = this._hotkeys[_hotkey]

    return ( _hotkeyCode && this._keys[_hotkeyCode] )
  }
}