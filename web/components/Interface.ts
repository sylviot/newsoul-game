export interface IScene {
  camera: any
  scene: any

  _keyboadEvent(hotkey: string)
  _mouseEvent(hotkey: string)
  update(): void
  render(): void

  down(): void
  up(): void

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