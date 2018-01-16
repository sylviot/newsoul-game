export interface IScene {
  _keyboadEvent(hotkey: string)
  _mouseEvent(hotkey: string)

  tryLoadTexture(_name: string)
}

export interface IElement {
  // _x: number
  // _y: number
  // _width: number
  // _height: number
  // _rotation: number

  loadData(data: any): void
  updateData(data: any): void
  update(delta: number): void
}